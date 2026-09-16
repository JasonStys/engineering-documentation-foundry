# Accessibility decisions

The publisher targets a static, progressively enhanced reading experience with no JavaScript
dependency.

## Implemented

- One page-level `h1`; extracted headings are nested beneath it.
- Real `table`, `caption`, `thead`, `tbody`, and `th scope="col"` elements.
- Safety notices use labeled `aside` landmarks and repeat severity in text.
- Navigation is a named `nav` list rather than an unlabeled link collection.
- Keyboard focus is high contrast and not dependent on color alone.
- Viewport, responsive widths, readable line height, and wrap-safe code values.
- Image blocks expose a visible review requirement rather than a misleading empty alternative.

## Human review still required

Reviewers must confirm heading hierarchy, table reading order, warning meaning, link purpose,
technical terminology, image alternatives, zoom behavior, contrast, and keyboard/screen-reader
operation in the deployment context.

The automated checks intentionally report images instead of inventing descriptions. An accurate
alternative depends on why the figure matters to the task, not merely on objects visible in it.
