import { sub } from "date-fns";

export const GENRES = {
  All: "all",
  Artbook: "artbook",
  Cartoon: "cartoon",
  Comic: "comic",
  Doujinshi: "doujinshi",
  Imageset: "imageset",
  Manga: "manga",
  Manhua: "manhua",
  Manhwa: "manhwa",
  Webtoon: "webtoon",
  Josei: "josei",
  Seinen: "seinen",
  Shoujo: "shoujo",
  "Shoujo ai": "shoujo_ai",
  Shounen: "shounen",
  "Shounen ai": "shounen_ai",
  Yaoi: "yaoi",
  Yuri: "yuri",
  Gore: "gore",
  Bloody: "bloody",
  Violence: "violence",
  Ecchi: "ecchi",
  Adult: "adult",
  Mature: "mature",
  Smut: "smut",
  Hentai: "hentai",
  "4-Koma": "_4_koma",
  Action: "action",
  Adaptation: "adaptation",
  Adventure: "adventure",
  Aliens: "aliens",
  Animals: "animals",
  Anthology: "anthology",
  Cars: "cars",
  Comedy: "comedy",
  Cooking: "cooking",
  Crime: "crime",
  Crossdressing: "crossdressing",
  Cultivation: "cultivation",
  Delinquents: "delinquents",
  Dementia: "dementia",
  Demons: "demons",
  Drama: "drama",
  Fantasy: "fantasy",
  "Fan-Colored": "fan_colored",
  "Full Color": "full_color",
  Game: "game",
  "Gender Bender": "gender_bender",
  Genderswap: "genderswap",
  Ghosts: "ghosts",
  Gyaru: "gyaru",
  Harem: "harem",
  Historical: "historical",
  Horror: "horror",
  Incest: "incest",
  Isekai: "isekai",
  Kids: "kids",
  Loli: "loli",
  Magic: "magic",
  "Magical Girls": "magical_girls",
  "Martial Arts": "martial_arts",
  Mecha: "mecha",
  Medical: "medical",
  Military: "military",
  "Monster Girls": "monster_girls",
  Monsters: "monsters",
  Music: "music",
  Mystery: "mystery",
  "Netorare/NTR": "netorare",
  Ninja: "ninja",
  "Office Workers": "office_workers",
  Oneshot: "oneshot",
  Parody: "parody",
  Philosophical: "philosophical",
  Police: "police",
  "Post-Apocalyptic": "post_apocalyptic",
  Psychological: "psychological",
  Reincarnation: "reincarnation",
  "Reverse Harem": "reverse_harem",
  Romance: "romance",
  Samurai: "samurai",
  "School Life": "school_life",
  "Sci-Fi": "sci_fi",
  Shota: "shota",
  "Slice of Life": "slice_of_life",
  "SM/BDSM": "sm_bdsm",
  Space: "space",
  Sports: "sports",
  "Super Power": "super_power",
  Superhero: "superhero",
  Supernatural: "supernatural",
  Survival: "survival",
  Thriller: "thriller",
  "Time Travel": "time_travel",
  "Traditional Games": "traditional_games",
  Tragedy: "tragedy",
  Vampires: "vampires",
  "Video Games": "video_games",
  Villainess: "villainess",
  "Virtual Reality": "virtual_reality",
  Wuxia: "wuxia",
  Xianxia: "xianxia",
  Xuanhuan: "xuanhuan",
  Zombies: "zombies",
  Chinese: "zh",
  English: "en",
  Japanese: "ja",
  Korean: "ko",
  Pending: "pending",
  Ongoing: "ongoing",
  Completed: "completed",
  Hiatus: "hiatus",
  Cancelled: "cancelled",
  "1 ~ 9": "1-9",
  "10 ~ 29": "10-29",
  "30 ~ 99": "30-99",
  "100 ~ 199": "100-199",
  "200+": "200",
  "100+": "100",
  "50+": "50",
  "10+": "10",
  "1+": "1",
};

/**
 * Parse title
 * @param title The title extracted from jquery
 * @returns Returns the parsed title
 */
export function extractChapterTitle(title: string) {
  const p = title.trim();

  return p
    .substring(p.indexOf(" ") + 1)
    .trim()
    .replace(/\s\s+/g, " ");
}

/**
 * Parse a string to only show digits
 * @param str The string to show only numbers
 * @returns Returns the string with numbers only
 */
export function digitsOnly(str: string) {
  return str.replace(/[^0-9\.]/g, "");
}

/**
 * Parse timestamp (e.g. 100 days ago) into a date string object
 * @param txt The text to parse into a date
 * @returns Returns a date string object
 */
export function parseTimestamp(txt: string) {
  const time = parseInt(txt.replace(/\D/g, ""));
  if (txt.indexOf("days") !== -1 || txt.indexOf("day") !== -1) {
    return sub(Date.now(), {
      days: time,
    }).toString();
  }
  if (txt.indexOf("hours") !== -1 || txt.indexOf("hour") !== -1) {
    return sub(Date.now(), {
      hours: time,
    }).toString();
  }

  if (txt.indexOf("mins") !== -1 || txt.indexOf("min") !== -1) {
    return sub(Date.now(), {
      minutes: time,
    }).toString();
  }

  if (txt.indexOf("secs") !== -1 || txt.indexOf("sec") !== -1) {
    return sub(Date.now(), {
      seconds: time,
    }).toString();
  }

  throw Error("Invalid date parsed: " + txt);
}

/**
 * Get v3 URL of MangaPark
 * @param urlPath The path of the manga. The API gives V5 path
 * @returns Returns the V3 version of the url path
 */
export function getV3URL(urlPath: string): string {
  const dashIndex = urlPath.indexOf("-");
  const newUrlPath = urlPath.replace("/title/", "/comic/");
  return (
    newUrlPath.substring(0, dashIndex) +
    "/" +
    newUrlPath.substring(dashIndex + 1)
  );
}

/**
 * Inverse of getV3URL
 * @param urlPath The path of the manga.
 * @returns Returns the V5 version of the URL path
 */
export function getV5URL(urlPath: string): string {
  const lastSlashIndex = urlPath.lastIndexOf("/");
  const newUrlPath = urlPath.replace("/comic/", "/title/");
  return (
    newUrlPath.substring(0, lastSlashIndex) +
    "_" +
    newUrlPath.substring(lastSlashIndex + 1)
  );
}
