import { Database, Model, Q, Query } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { children, date, field, writer } from '@nozbe/watermelondb/decorators';
import {
  InvalidSourceException,
  Manga,
  MangaMeta,
  MangaSource,
} from '@mangayomu/mangascraper';
import type { ISOLangCode } from '@mangayomu/language-codes';
import { LOCAL_MANGA_ID, Table } from '@/models/schema';
import { LocalChapter } from '@/models/LocalChapter';
import { Genre } from '@/models/Genre';
import { Author } from '@/models/Author';
import { isChapter } from '@/utils/helpers';

export class LocalManga extends Model {
  static table = Table.LOCAL_MANGAS;
  static associations: Associations = {
    [Table.LOCAL_CHAPTERS]: {
      type: 'has_many',
      foreignKey: LOCAL_MANGA_ID,
    },
    [Table.GENRES]: {
      type: 'has_many',
      foreignKey: LOCAL_MANGA_ID,
    },
    [Table.AUTHORS]: {
      type: 'has_many',
      foreignKey: LOCAL_MANGA_ID,
    },
    [Table.HISTORY_ENTRIES]: {
      type: 'has_many',
      foreignKey: LOCAL_MANGA_ID,
    },
  };

  @field('link') link!: string;
  @field('title') title!: string;
  @field('source') source!: string;

  @field('description') description?: string | null;
  @field('image_cover') imageCover?: string | null;
  @field('language') language?: ISOLangCode | null;
  @field('is_hentai') isHentai?: boolean | null;
  @field('scan_status') scanStatus?: string | null;
  @field('publish_status') publishStatus?: string | null;
  @field('type') type?: string | null;
  @field('year_released') yearReleased?: number | null;
  @date('date_published') datePublished?: Date | null;
  @date('date_modified') dateModified?: Date | null;
  @field('is_rating_value_na') isRatingValueNA?: boolean | null;
  @field('rating_value') ratingValue?: number | null;
  @field('vote_count') voteCount?: number | null;
  @field('is_official_translation') isOfficialTranslation?: boolean;

  @field('sort_chapters_by') sortChaptersBy!: string;
  @field('is_sort_reversed') isSortReversed!: boolean;

  @children(Table.LOCAL_CHAPTERS) chapters!: Query<LocalChapter>;
  @children(Table.GENRES) _dbGenres!: Query<Genre>;
  @children(Table.AUTHORS) _dbAuthors!: Query<Author>;

  get genres() {
    return this._dbGenres.fetch().then((a) => a.map((x) => x.name));
  }

  get authors() {
    return this._dbAuthors.fetch().then((a) => a.map((x) => x.name));
  }

  get rating() {
    if (this.ratingValue == null) return undefined;
    return {
      value: this.isRatingValueNA ? ('N/A' as const) : this.ratingValue,
      voteCount: this.voteCount ?? 0,
    };
  }

  get meta(): Promise<Manga & MangaMeta> {
    return new Promise((res) => {
      Promise.all([this.authors, this.genres, this.chapters]).then(
        ([authors, genres, chapters]) =>
          res({
            title: this.title,
            link: this.link,
            source: this.source,
            imageCover: this.imageCover,
            description: this.description,
            language: this.language,
            isHentai: this.isHentai ?? undefined,
            status:
              this.publishStatus != null
                ? {
                    scan: this.scanStatus,
                    publish: this.publishStatus,
                  }
                : undefined,
            type: this.type ?? undefined,
            yearReleased: this.yearReleased?.toString(),
            genres,
            date:
              this.datePublished != null && this.dateModified != null
                ? {
                    modified: this.dateModified.getTime(),
                    published: this.datePublished.getTime(),
                  }
                : undefined,
            authors,
            chapters,
            officialTranslation: this.isOfficialTranslation,
            rating: this.rating,
          }),
      );
    });
  }

  static async toLocalManga(data: Manga & MangaMeta, database: Database) {
    function addFields(_model: Model) {
      const model = _model as LocalManga;
      model.title = data.title;
      model.link = data.link;
      model.source = data.source;
      model.description = data.description;
      model.imageCover = data.imageCover;
      model.language = data.language;
      model.isHentai = data.isHentai;
      model.scanStatus = data.status?.scan;
      model.publishStatus = data.status?.publish;
      model.type = data.type;
      model.yearReleased =
        data.yearReleased != null ? parseInt(data.yearReleased) : null;
      model.dateModified = data.date ? new Date(data.date.modified) : null;
      model.datePublished = data.date ? new Date(data.date.published) : null;
      model.isOfficialTranslation = data.officialTranslation;
      model.voteCount = data.rating?.voteCount;
      model.ratingValue = data.rating?.value === 'N/A' ? 0 : data.rating?.value;
      model.isRatingValueNA = data.rating?.value === 'N/A';
      model.sortChaptersBy = 'Chapter number';
      model.isSortReversed = false;
    }

    const localMangas = database.get(Table.LOCAL_MANGAS);
    const localChapters = database.get(Table.LOCAL_CHAPTERS);
    const [existingLocalManga, existingLocalChapters] = await Promise.all([
      localMangas.query(Q.where('link', data.link)),
      localChapters.query(Q.on(Table.LOCAL_MANGAS, Q.where('link', data.link))),
    ]);
    const operations: Model[] = existingLocalChapters
      .map((x) => x.prepareDestroyPermanently())
      .concat(
        data.chapters.map((x) =>
          localChapters.prepareCreate((record) => {
            const source = MangaSource.getSource(data.source);
            if (source == null) throw new InvalidSourceException(data.source);
            const localChapter = record as LocalChapter;
            const l = isChapter(x) ? x : source.toChapter(x, data);
            localChapter.name = l.name;
            localChapter.subname = l.subname;
            localChapter.date = new Date(l.date);
            localChapter.link = l.link;
            localChapter.manga.set(preparedUpdate);
          }),
        ),
      );

    let preparedUpdate: LocalManga;

    // update if exists
    if (existingLocalManga.length > 0) {
      preparedUpdate = existingLocalManga[0].prepareUpdate(
        addFields,
      ) as LocalManga;
    }
    // create since it does not exist
    else {
      preparedUpdate = localMangas.prepareCreate(addFields) as LocalManga;
    }
    operations.push(preparedUpdate);
    await database.write(async () => {
      await database.batch(operations);
    });
  }
}
