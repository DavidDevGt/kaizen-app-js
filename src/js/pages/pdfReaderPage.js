class PDFReaderPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.CONFIG = {
            title: "Lector de PDF",
            toolbarButtons: [
                { icon: "⏪", label: "Página anterior", action: "prev" },
                { icon: "⏩", label: "Página siguiente", action: "next" },
                { icon: "🔍", label: "Buscar texto", action: "search" },
                { icon: "🖨", label: "Imprimir", action: "print" }
            ],
            footerText: "© 2025 PDF-Reader. Todos los derechos reservados."
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
              --primary-color: #4CAF50;
              --toolbar-bg: #F1F1F1;
              --text-color: #333;
              --border-color: #DDD;
              --spacing: 1rem;
              --transition: 0.3s ease;
              display: block;
              font-family: sans-serif;
              color: var(--text-color);
              background: #fff;
              height: 100%;
            }
    
            .layout-container {
              display: flex;
              flex-direction: column;
              height: 100%;
            }
    
            /* Barra de herramientas */
            header {
              background-color: var(--toolbar-bg);
              border-bottom: 1px solid var(--border-color);
              padding: var(--spacing);
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
    
            header h2 {
              margin: 0;
              font-size: 1.2rem;
            }
    
            .toolbar {
              display: flex;
              gap: 0.5rem;
            }
    
            .toolbar button {
              background: transparent;
              border: none;
              cursor: pointer;
              font-size: 1.2rem;
              transition: background var(--transition);
              border-radius: 4px;
              padding: 0.25rem 0.5rem;
            }
    
            .toolbar button:hover {
              background: #e0e0e0;
            }
    
            /* Contenido principal */
            main {
              flex: 1;
              overflow: auto;
              display: flex;
              justify-content: center;
              align-items: center;
              /* Aquí se integraría tu componente PDF real */
            }
    
            .placeholder {
              text-align: center;
              color: #888;
              font-style: italic;
            }
    
            /* Pie de página */
            footer {
              background-color: var(--toolbar-bg);
              border-top: 1px solid var(--border-color);
              padding: var(--spacing);
              text-align: center;
              font-size: 0.9rem;
            }
    
            .pagination {
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
            }
    
            .pagination button {
              background: transparent;
              border: 1px solid var(--border-color);
              border-radius: 4px;
              padding: 0.25rem 0.5rem;
              cursor: pointer;
            }
    
            .pagination button:hover {
              background: #e0e0e0;
            }
          </style>
    
          <div class="layout-container">
            <!-- Barra de Herramientas / Encabezado -->
            <header>
              <h2>${this.CONFIG.title}</h2>
              <div class="toolbar">
                ${this.CONFIG.toolbarButtons.map(btn => `
                  <button 
                    title="${btn.label}" 
                    data-action="${btn.action}">
                    ${btn.icon}
                  </button>
                `).join('')}
              </div>
            </header>
    
            <!-- Contenido Principal -->
            <main>
              <!-- Aquí podrías inyectar tu visor de PDF real -->
              <div class="placeholder">
                (Visor de PDF no implementado, solo layout)
              </div>
            </main>
    
            <!-- Pie de página (paginación + info) -->
            <footer>
              <div class="pagination">
                <button data-action="prev">Anterior</button>
                <span>Página <strong id="current-page">${this.state.currentPage}</strong> de <strong id="total-pages">${this.state.totalPages}</strong></span>
                <button data-action="next">Siguiente</button>
              </div>
              <div class="footer-info">
                ${this.CONFIG.footerText}
              </div>
            </footer>
          </div>
        `;
    }

    setupEventListeners() {
        // Botones del toolbar
        const toolbarButtons = this.shadowRoot.querySelectorAll('.toolbar button');
        toolbarButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleToolbarAction(action);
            });
        });

        // Botones de paginación en el footer
        const paginationButtons = this.shadowRoot.querySelectorAll('.pagination button');
        paginationButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handlePagination(action);
            });
        });
    }

    cleanup() {
        // Eliminar listeners si fuera necesario
    }

    handleToolbarAction(action) {
        switch (action) {
            case 'prev':
                // Podrías delegar a la lógica de cambiar página
                this.handlePagination('prev');
                break;
            case 'next':
                // idem
                this.handlePagination('next');
                break;
            case 'search':
                alert("Acción de búsqueda no implementada.");
                break;
            case 'print':
                alert("Acción de impresión no implementada.");
                break;
            default:
                console.warn("Acción de toolbar no reconocida:", action);
        }
    }

    handlePagination(action) {
        /** MEJORAR ESTO */
        const { currentPage, totalPages } = this.state;
        if (action === 'prev' && currentPage > 1) {
            this.state.currentPage--;
        } else if (action === 'next' && currentPage < totalPages) {
            this.state.currentPage++;
        }
        /** MEJORAR ESTO PARA ACTUALIZAR EL VISOR DE PDF */
        this.shadowRoot.getElementById('current-page').textContent = this.state.currentPage;
    }
}

customElements.define('pdf-reader-page', PDFReaderPage);
export default PDFReaderPage;