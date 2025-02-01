class PDFReaderPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.CONFIG = {
      title: "Lector de PDF",
      toolbarButtons: [
        { icon: "⏪", label: "Página anterior", action: "prev" },
        { icon: "⏩", label: "Página siguiente", action: "next" },
        { icon: "🖨", label: "Imprimir", action: "print" }
      ]
    };
    this.state = {
      currentPage: 1,
      totalPages: 10
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
        background-color: white;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .title-and-back {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-grow: 1;
      }

      h2 {
        margin: 0;
        font-size: 1.25rem;
        flex-grow: 1;
        text-align: center;
      }

      .back-btn {
        background: lightgray;
        font-size: 1.5rem;
        cursor: pointer;
        border: none;
        display: flex;
        padding: 0.35rem;
        border-radius: 4px;
        justify-content: center;
        align-items: center;
        scale: 0.7;
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
        transition: background 0.2s, transform 0.1s;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .toolbar button:hover {
        background: #cbd5e1;
      }

      .toolbar button:active {
        transform: scale(0.95);
      }

      main {
        flex: 1;
        overflow: auto;
        padding: 1rem;
        display: flex;
        justify-content: center;
        align-items: flex-start;
      }

      .document-container {
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 800px;
        aspect-ratio: 1/1.4142;
        position: relative;
        overflow: hidden;
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
    </style>

    <div class="layout-container">
      <header>
        <div class="title-and-back">
          <button class="back-btn" id="go-home">🔙</button>
          <h2>${this.CONFIG.title}</h2>
        </div>
        <div class="toolbar">
          ${this.CONFIG.toolbarButtons
            .map((btn) => `
              <button title="${btn.label}" data-action="${btn.action}">
                ${btn.icon}
              </button>
            `)
            .join("")}
        </div>
      </header>

      <main>
        <div class="document-container">
          <div class="placeholder">
            <span>PDF Viewer Component (Placeholder)</span>
          </div>
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
    this.shadowRoot.querySelector("#go-home").addEventListener("click", () => window.router.loadRoute("/"));

  }

  cleanup() {}

  handleAction(action) {
    switch (action) {
      case "prev":
        if (this.state.currentPage > 1) {
          this.state.currentPage--;
          this.updateUI();
        }
        break;
      case "next":
        if (this.state.currentPage < this.state.totalPages) {
          this.state.currentPage++;
          this.updateUI();
        }
        break;
      case "print":
        alert("Funcionalidad de impresión no implementada.");
        break;
      default:
        console.warn("Acción de toolbar no reconocida:", action);
    }
  }

  updateUI() {}
}

customElements.define("pdf-reader-page", PDFReaderPage);
export default PDFReaderPage;
