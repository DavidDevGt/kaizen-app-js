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

  /* Clase para la animación de cambio de página */
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

class PDFReaderPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.CONFIG = {
      title: "PDF Reader",
      toolbarButtons: [
        { icon: "⏪", label: "Página anterior", action: "prev" },
        { icon: "⏩", label: "Página siguiente", action: "next" },
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
        ${styles}
      </style>
      <div class="layout-container">
        <header>
          <div class="title-and-back">
            <button class="back-btn" id="go-home">🏠</button>
            <h2>${this.CONFIG.title}</h2>
          </div>
          <div class="toolbar">
            ${this.CONFIG.toolbarButtons.map((btn) => `
              <button title="${btn.label}" data-action="${btn.action}">
                ${btn.icon}
              </button>
            `).join('')}
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
    this.shadowRoot.querySelector("#go-home").addEventListener("click", () => window.router.loadRoute("/"));
  }

  cleanup() {
    // Implementar si es necesario remover listeners
  }

  handleAction(action) {
    switch (action) {
      case "prev":
        if (this.state.currentPage > 1) {
          this.changePage(this.state.currentPage - 1);
        }
        break;
      case "next":
        if (this.state.currentPage < this.state.totalPages) {
          this.changePage(this.state.currentPage + 1);
        }
        break;
      case "print":
        alert("Funcionalidad de impresión no implementada.");
        break;
      default:
        console.warn("Acción de toolbar no reconocida:", action);
    }
  }

  changePage(newPage) {
    const docContainer = this.shadowRoot.getElementById("doc-container");
    docContainer.classList.add("fade-out");
    setTimeout(() => {
      this.state.currentPage = newPage;
      this.updatePageIndicator();
      docContainer.classList.remove("fade-out");
    }, 200);
  }

  updatePageIndicator() {
    const indicator = this.shadowRoot.getElementById("page-indicator");
    indicator.textContent = `Página ${this.state.currentPage} de ${this.state.totalPages}`;
  }
}

customElements.define("pdf-reader-page", PDFReaderPage);
export default PDFReaderPage;
