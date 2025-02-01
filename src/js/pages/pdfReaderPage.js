
const styles = `
  :host {
    display: block;
    font-family: system-ui, -apple-system, sans-serif;
    color: #1e293b;
    background: #f8fafc;
    height: 100%;
  }
  .layout-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }
  header {
    background: linear-gradient(135deg, #ffffff, #f0f4ff);
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 10;
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }
  header:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  .title-and-back {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }
  h2 {
    margin: 0;
    font-size: 1.25rem;
    flex-grow: 1;
    text-align: center;
    font-weight: 600;
    color: #1e293b;
    transition: color 0.3s ease;
  }
  .back-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background 0.2s ease, transform 0.2s ease;
    color: #1e293b;
  }
  .back-btn:hover {
    background: rgba(30, 41, 59, 0.1);
  }
  .back-btn:active {
    transform: scale(0.9) rotate(-5deg);
  }
  .toolbar {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .toolbar button {
    background: #e2e8f0;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.2s ease, transform 0.1s ease;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1e293b;
  }
  .toolbar button:hover {
    background: #cbd5e1;
    transform: scale(1.05);
  }
  .toolbar button:active {
    transform: scale(0.95);
  }
  main {
    flex: 1;
    overflow: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
  }
  .document-container {
    background: #ffffff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 800px;
    aspect-ratio: 1 / 1.4142;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  .document-container.fade-out {
    opacity: 0;
    transform: scale(0.95);
  }
  .placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 1rem;
  }
  .page-indicator {
    font-size: 0.9rem;
    color: #4b5563;
    margin-top: 0.5rem;
  }
  @media (max-width: 640px) {
    header {
      flex-direction: column;
      gap: 0.5rem;
    }
    .toolbar {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
`;
import PDFService from '../services/pdfService';
import { PDFViewer } from 'capacitor7-pdf-viewer';
import { Filesystem, Directory } from '@capacitor/filesystem';

/**
 * Componente PDFReaderPage:
 * - Selecciona un PDF (base64) desde "PDFService.pickPDF()"
 * - Lo guarda en el Filesystem
 * - Llama a PDFViewer.openPDF({ url: 'ruta-nativa-del-archivo' })
 * - Deja de usar <iframe>, pues la vista nativa reemplaza su función.
 */
class PDFReaderPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.CONFIG = {
      title: "PDF Reader",
      toolbarButtons: [
        { icon: "📄", label: "Seleccionar PDF", action: "pick" },
        { icon: "⏪", label: "Página anterior", action: "prev" },
        { icon: "⏩", label: "Página siguiente", action: "next" },
      ],
    };
    this.state = {
      currentPage: 1,
      totalPages: 10, // Valor por defecto (sin pdf.js, no sabemos el total real)
      pdfFile: null,
      pdfUrl: null,
    };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${styles}
      </style>
      <div class="layout-container">
        <header>
          <div class="title-and-back">
            <button class="back-btn" id="go-home">🏠</button>
            <h2>${this.CONFIG.title}</h2>
          </div>
          <div class="toolbar">
            ${this.CONFIG.toolbarButtons
              .map(
                (btn) => `
                <button title="${btn.label}" data-action="${btn.action}">
                  ${btn.icon}
                </button>
              `
              )
              .join("")}
          </div>
        </header>
        <main>
          <div class="document-container" id="doc-container">
            <div class="placeholder">
              <span>PDF Viewer Component (Placeholder)</span>
            </div>
          </div>
          <div class="page-indicator" id="page-indicator">
            Página ${this.state.currentPage} de ${this.state.totalPages}
          </div>
        </main>
      </div>
    `;
  }

  setupEventListeners() {
    this.shadowRoot.querySelectorAll(".toolbar button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleAction(action);
      });
    });
    this.shadowRoot
      .querySelector("#go-home")
      .addEventListener("click", () => {
        if (window.router) {
          window.router.loadRoute("/");
        }
      });
  }

  cleanup() {
    // Remover listeners si es necesario
  }

  async handleAction(action) {
    switch (action) {
      case "prev":
      case "next":
        // Si el visor es 100% nativo, la navegación la maneja la propia Activity nativa.
        // Puedes mostrar un alert o desactivar estos botones.
        alert("Navegación nativa: usa el visor del plugin en Android.");
        break;
      case "pick":
        // Llama al servicio para seleccionar el PDF
        const file = await PDFService.pickPDF();
        if (file) {
          this.state.pdfFile = file;
          this.loadPDF(file); // Maneja la carga nativa
        } else {
          console.warn("No se seleccionó ningún PDF.");
        }
        break;
      case "print":
        alert("Funcionalidad de impresión no implementada.");
        break;
      default:
        console.warn("Acción de toolbar no reconocida:", action);
    }
  }

  updatePageIndicator() {
    console.log(
      `DEBUG -> updatePageIndicator() called. current page: ${this.state.currentPage}, total pages: ${this.state.totalPages}`
    );
    const indicator = this.shadowRoot.getElementById("page-indicator");
    indicator.textContent = `Página ${this.state.currentPage} de ${this.state.totalPages}`;
  }

  /**
   * Carga el PDF usando el plugin nativo en lugar de iframe.
   * file.data es un string Base64 ("JVBERi0xLjQK...").
   */
  async loadPDF(file) {
    console.log(`DEBUG -> loadPDF() called with file: `, JSON.stringify(file));

    if (!file.data) {
      console.error("No se encontró la data del PDF (base64).");
      return;
    }

    try {
      // 1) Guardar Base64 en el Filesystem
      const fileName = `picked-${Date.now()}.pdf`;
      console.log("DEBUG -> Escribiendo PDF en Filesystem...");
      await Filesystem.writeFile({
        path: fileName,
        data: file.data, // Base64
        directory: Directory.Documents, // O Directory.Data u otro
        recursive: true,
      });

      // 2) Obtener ruta nativa para pasársela al plugin
      const uriResult = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Documents,
      });

      console.log("DEBUG -> Ruta nativa del PDF:", uriResult.uri);

      // 3) Usar el plugin nativo para abrir el PDF
      console.log("DEBUG -> Abriendo PDF con plugin nativo...");
      await PDFViewer.openPDF({ url: uriResult.uri });

      // 4) (Opcional) Actualiza estado/indicador
      this.state.pdfUrl = uriResult.uri;
      this.state.currentPage = 1;
      this.updatePageIndicator();
      console.log("DEBUG -> PDF abierto exitosamente en Android nativo.");

    } catch (err) {
      console.error("Error abriendo PDF de forma nativa:", err);
    }
  }
}

customElements.define("pdf-reader-page", PDFReaderPage);
export default PDFReaderPage;
