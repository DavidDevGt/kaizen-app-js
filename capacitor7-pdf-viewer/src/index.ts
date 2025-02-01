import { registerPlugin } from '@capacitor/core';

import type { PDFViewerPlugin } from './definitions';

const PDFViewer = registerPlugin<PDFViewerPlugin>('PDFViewer', {
  web: () => import('./web').then((m) => new m.PDFViewerWeb()),
});

export * from './definitions';
export { PDFViewer };
