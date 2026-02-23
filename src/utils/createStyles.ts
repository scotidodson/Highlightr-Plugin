import {
  HighlightrSettings,
  getHighlighterHex,
  getHighlighterFont,
  highlighterSlug,
} from "src/settings/settingsData";
import { setAttributes } from "./setAttributes";

function addNewStyle(selector: string, style: string, sheet: HTMLElement) {
  sheet.textContent += selector + ` {\n  ${style}\n}\n\n`;
}

export function createStyles(settings: HighlightrSettings) {
  const styleSheet = document.createElement("style");
  setAttributes(styleSheet, {
    type: "text/css",
    id: "highlightr-styles",
  });

  const header = document.getElementsByTagName("HEAD")[0];
  header.appendChild(styleSheet);

  // Define CSS variables in :root so inline marks and classes both use them.
  // Changing a color in settings updates these variables and all existing highlights update.
  const rootVars: string[] = [];
  Object.keys(settings.highlighters).forEach((highlighter) => {
    const entry = settings.highlighters[highlighter];
    const hex = getHighlighterHex(entry);
    const fontColor =
      getHighlighterFont(entry) === "dark" ? "#1d1d1d" : "#ffffff";
    const slug = highlighterSlug(highlighter);
    rootVars.push(`  --highlightr-${slug}-background: ${hex};`);
    rootVars.push(`  --highlightr-${slug}-font-color: ${fontColor};`);
  });
  if (rootVars.length) {
    styleSheet.textContent += `:root {\n${rootVars.join("\n")}\n}\n\n`;
  }

  // Class-based rules reference the same variables
  Object.keys(settings.highlighters).forEach((highlighter) => {
    const slug = highlighterSlug(highlighter);
    addNewStyle(
      `.hltr-${slug},\nmark.hltr-${slug},\n.markdown-preview-view mark.hltr-${slug}`,
      `background: var(--highlightr-${slug}-background); color: var(--highlightr-${slug}-font-color);`,
      styleSheet
    );
  });

  // Per-color highlight styles (lowlight, floating, rounded, realistic) applied via .hltr-style-*
  styleSheet.textContent += `
/* highlightr per-mark style: lowlight */
mark.hltr-style-lowlight,
span.cm-highlight.hltr-style-lowlight,
.markdown-preview-view mark.hltr-style-lowlight {
  --lowlight-background: var(--background-primary);
  border-radius: 0;
  background-image: linear-gradient(360deg, rgba(255, 255, 255, 0) 40%, var(--lowlight-background) 40%) !important;
}
.workspace-split.mod-left-split mark.hltr-style-lowlight,
.workspace-split.mod-left-split span.cm-highlight.hltr-style-lowlight,
.workspace-split.mod-left-split .markdown-preview-view mark.hltr-style-lowlight,
.workspace-split.mod-right-split mark.hltr-style-lowlight,
.workspace-split.mod-right-split span.cm-highlight.hltr-style-lowlight,
.workspace-split.mod-right-split .markdown-preview-view mark.hltr-style-lowlight {
  --lowlight-background: var(--background-secondary);
}
.admonition-content mark.hltr-style-lowlight,
.admonition-content span.cm-highlight.hltr-style-lowlight,
.admonition-content > .markdown-preview-view mark.hltr-style-lowlight {
  --lowlight-background: var(--background-primary-alt);
}

/* highlightr per-mark style: floating */
mark.hltr-style-floating,
span.cm-highlight.hltr-style-floating,
.markdown-preview-view mark.hltr-style-floating {
  --floating-background: var(--background-primary);
  border-radius: 0;
  padding-bottom: 5px;
  background-image: linear-gradient(360deg, rgba(255, 255, 255, 0) 28%, var(--floating-background) 28%) !important;
}
.workspace-split.mod-left-split mark.hltr-style-floating,
.workspace-split.mod-left-split span.cm-highlight.hltr-style-floating,
.workspace-split.mod-left-split .markdown-preview-view mark.hltr-style-floating,
.workspace-split.mod-right-split mark.hltr-style-floating,
.workspace-split.mod-right-split span.cm-highlight.hltr-style-floating,
.workspace-split.mod-right-split .markdown-preview-view mark.hltr-style-floating {
  --floating-background: var(--background-secondary);
}
.admonition-content mark.hltr-style-floating,
.admonition-content span.cm-highlight.hltr-style-floating,
.admonition-content > .markdown-preview-view mark.hltr-style-floating {
  --floating-background: var(--background-primary-alt);
}

/* highlightr per-mark style: rounded */
mark.hltr-style-rounded,
.markdown-preview-view mark.hltr-style-rounded {
  margin: 0 -0.05em;
  padding: 0.125em 0.15em;
  border-radius: 0.2em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
span.cm-highlight.hltr-style-rounded {
  border-radius: 0.2em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
.cm-s-obsidian span.cm-highlight.hltr-style-rounded { font-weight: inherit; }
.hltr-style-rounded.cm-highlight + span.cm-formatting-highlight,
.cm-highlight + span.cm-formatting-highlight.hltr-style-rounded { padding-left: 0; padding-right: 0.15em; -webkit-box-decoration-break: clone; box-decoration-break: clone; }

/* highlightr per-mark style: realistic */
mark.hltr-style-realistic,
.markdown-preview-view mark.hltr-style-realistic {
  margin: 0 -0.05em;
  padding: 0.1em 0.4em;
  border-radius: 0.8em 0.3em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  text-shadow: 0 0 0.75em var(--background-primary-alt);
}
.hide-tokens .cm-s-obsidian span.cm-highlight.hltr-style-realistic,
.cm-s-obsidian span.cm-highlight.hltr-style-realistic {
  padding: 0.15em 0.25em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  text-shadow: 0 0 0.75em var(--background-primary-alt);
}
.cm-s-obsidian span.cm-formatting-highlight.hltr-style-realistic { margin: 0 0 0 -0.05em; padding: 0.15em 0.25em; border-radius: 0.8em 0 0 0.3em; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.cm-s-obsidian .cm-highlight + span.cm-formatting-highlight.hltr-style-realistic { margin: 0 -0.05em 0 0; padding: 0.15em 0.25em; border-radius: 0 0.3em 0.8em 0; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
`;
}
