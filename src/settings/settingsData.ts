export const HIGHLIGHTER_STYLES = [
  "none",
  "lowlight",
  "floating",
  "rounded",
  "realistic",
] as const;

export type HighlighterStyle = (typeof HIGHLIGHTER_STYLES)[number];

export const HIGHLIGHTER_METHODS = ["css-classes", "inline-styles"];

export type HighlighterFont = "dark" | "light";

export interface HighlighterEntry {
  hex: string;
  font: HighlighterFont;
  style: HighlighterStyle;
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

export function getHighlighterStyle(entry: string | HighlighterEntry): HighlighterStyle {
  if (typeof entry === "string") return "none";
  return entry.style ?? "none";
}

/** CSS-safe slug from highlighter name for variable names (e.g. "Celery" → "celery", "Highlight Yellow" → "highlight-yellow") */
export function highlighterSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/** CSS variable names for a highlighter (used in styles and inline marks so colors can be updated globally) */
export function highlighterCssVars(slug: string) {
  return {
    background: `var(--highlightr-${slug}-background)`,
    fontColor: `var(--highlightr-${slug}-font-color)`,
  };
}

const DEFAULT_ENTRIES: Record<string, HighlighterEntry> = {
  Celery: { hex: "#e6feaa", font: "dark", style: "none" },
  Pink: { hex: "#FFB8EBA6", font: "dark", style: "none" },
  Red: { hex: "#FF5582A6", font: "dark", style: "none" },
  Orange: { hex: "#FFB86CA6", font: "dark", style: "none" },
  Yellow: { hex: "#FFF3A3A6", font: "dark", style: "none" },
  Green: { hex: "#BBFABBA6", font: "dark", style: "none" },
  Cyan: { hex: "#ABF7F7A6", font: "dark", style: "none" },
  Blue: { hex: "#ADCCFFA6", font: "dark", style: "none" },
  Purple: { hex: "#D2B3FFA6", font: "dark", style: "none" },
  Graphite: { hex: "#535353", font: "light", style: "none" },
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
    if (typeof v === "string") {
      out[k] = { hex: v, font: "dark", style: "none" };
    } else {
      out[k] = { ...v, style: (v as HighlighterEntry).style ?? "none" };
    }
  }
  return out;
}

export default DEFAULT_SETTINGS;
