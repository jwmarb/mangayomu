import {
  ExclusiveInclusiveFilter,
  WithGenresFilter,
  WithOfficialTranslationFilter,
  WithSortFilter,
  WithStatusFilter,
} from '@services/scraper/scraper.interfaces';

class FilterValidator {
  public isIncludeExcludeFilter(obj: any): obj is ExclusiveInclusiveFilter<unknown> {
    return 'include' in obj && 'exclude' in obj && Array.isArray(obj.include) && Array.isArray(obj.exclude);
  }
  public hasSortFilter(filter: any): filter is WithSortFilter {
    return 'sort' in filter && Array.isArray(filter.sort) && typeof filter.sort[0] === 'boolean';
  }
  public hasGenresFilter(filter: any): filter is WithGenresFilter {
    return 'genres' in filter && this.isIncludeExcludeFilter(filter.genres);
  }

  public hasStatusFilter(filter: any): filter is WithStatusFilter {
    return 'status' in filter;
  }

  public hasOfficialTranslationFilter(filter: any): filter is WithOfficialTranslationFilter {
    return 'officialTranslation' in filter;
  }
}

export default new FilterValidator();
