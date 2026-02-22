export const HIGHLIGHTER_STYLES = [
  "none",
  "lowlight",
  "floating",
  "rounded",
  "realistic",
];

export const HIGHLIGHTER_METHODS = ["css-classes", "inline-styles"];

export type HighlighterFont = "dark" | "light";

export interface HighlighterEntry {
  hex: string;
  font: HighlighterFont;
}

/** Legacy format stored hex as string; we support both and migrate on load */
export interface Highlighters {
  [color: string]: string | HighlighterEntry;
}

export interface HighlightrSettings {
  highlighterStyle: string;
  highlighterMethods: string;
  highlighters: Highlighters;
  highlighterOrder: string[];
}

export function getHighlighterHex(entry: string | HighlighterEntry): string {
  return typeof entry === "string" ? entry : entry.hex;
}

export function getHighlighterFont(entry: string | HighlighterEntry): HighlighterFont {
  return typeof entry === "string" ? "dark" : entry.font;
}

const DEFAULT_ENTRIES: Record<string, HighlighterEntry> = {
  Celery: { hex: "#535353;", font: "dark" },
  Pink: { hex: "#FFB8EBA6", font: "dark" },
  Red: { hex: "#FF5582A6", font: "dark" },
  Orange: { hex: "#FFB86CA6", font: "dark" },
  Yellow: { hex: "#FFF3A3A6", font: "dark" },
  Green: { hex: "#BBFABBA6", font: "dark" },
  Cyan: { hex: "#ABF7F7A6", font: "dark" },
  Blue: { hex: "#ADCCFFA6", font: "dark" },
  Purple: { hex: "#D2B3FFA6", font: "dark" },
  Graphite: { hex: "#535353", font: "light" },
};

const DEFAULT_SETTINGS: HighlightrSettings = {
  highlighterStyle: "none",
  highlighterMethods: "inline-styles",
  highlighters: { ...DEFAULT_ENTRIES },
  highlighterOrder: [],
};

DEFAULT_SETTINGS.highlighterOrder = Object.keys(DEFAULT_SETTINGS.highlighters);

/** Normalize loaded highlighters to HighlighterEntry (migrate legacy string values) */
export function migrateHighlighters(highlighters: Highlighters): Highlighters {
  const out: Highlighters = {};
  for (const k of Object.keys(highlighters)) {
    const v = highlighters[k];
    out[k] = typeof v === "string" ? { hex: v, font: "dark" } : v;
  }
  return out;
}

export default DEFAULT_SETTINGS;
