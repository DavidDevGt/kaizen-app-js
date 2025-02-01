export interface PDFViewerPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  openPDF(options: { filePath: string }): Promise<void>;
}
