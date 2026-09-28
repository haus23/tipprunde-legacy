import { apiReference } from '@scalar/express-api-reference';
import type { RequestHandler } from 'express';

import { openApiDocument } from './openapi.ts';

const customCss = `
  :root {
    --scalar-font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --scalar-font-code: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .light-mode {
    --scalar-color-1: hsl(260, 25%, 11%);
    --scalar-color-2: hsl(252, 4%, 44.8%);
    --scalar-color-3: hsl(252, 4%, 57.3%);
    --scalar-color-accent: hsl(250, 43%, 48%);
    --scalar-background-1: hsl(300, 20%, 99%);
    --scalar-background-2: hsl(300, 7.7%, 97.5%);
    --scalar-background-3: hsl(294, 5.5%, 95.3%);
    --scalar-background-accent: hsl(252, 96.9%, 97.4%);
    --scalar-border-color: hsl(271, 3.9%, 86.3%);
  }

  .dark-mode {
    --scalar-color-1: hsl(256, 6%, 93.2%);
    --scalar-color-2: hsl(253, 4%, 63.7%);
    --scalar-color-3: hsl(247, 3.4%, 50.7%);
    --scalar-color-accent: hsl(250, 95%, 76.8%);
    --scalar-background-1: hsl(246, 6%, 9%);
    --scalar-background-2: hsl(240, 5.1%, 11.6%);
    --scalar-background-3: hsl(241, 5%, 14.3%);
    --scalar-background-accent: hsl(253, 37%, 18.4%);
    --scalar-border-color: hsl(245, 4.9%, 25.4%);
  }
`;

export const openApiHandler: RequestHandler = (_req, res) => {
  res.json(openApiDocument);
};

export const docsHandler = apiReference({
  pageTitle: 'runde.tips API-Dokumentation',
  url: '/openapi.json',
  theme: 'none',
  layout: 'modern',
  withDefaultFonts: false,
  customCss,
});
