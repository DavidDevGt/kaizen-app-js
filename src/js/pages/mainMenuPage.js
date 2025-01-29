class MainMenuPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const menuConfig = [
            { id: 'tasks', title: 'TaskManager', description: 'Gestiona tus tareas' },
            { id: 'expenses', title: 'ExpenseTracker', description: 'Controla tus gastos' },
            { id: 'notes', title: 'FaztNotes', description: 'Toma notas rápidas' },
            { id: 'settings', title: 'Settings', description: 'Configurar la app' }
        ];

        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;600&display=swap');
                .menu { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; justify-content: center; align-items: center; padding: 20px; font-family: 'Poppins', sans-serif; max-width: 600px; margin: auto; }
                .menu-item { background-color: #007bff; color: white; padding: 30px; border-radius: 10px; text-align: center; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); transition: background-color 0.3s, transform 0.3s; cursor: pointer; }
                .menu-item:hover { background-color: #025CBC; transform: translateY(-2px); }
                .menu-item h2 { font-weight: 600; margin: 0; font-size: 24px; }
                .menu-item p { font-weight: 100; margin: 10px 0 0; font-size: 20px; color: #e0e0e0; }
                @media (max-width: 500px) { .menu { grid-template-columns: 1fr; } }
            </style>
            <div class="menu">
                ${menuConfig.map(item => `
                    <div class="menu-item" data-route="${item.id}">
                        <h2>${item.title}</h2>
                        <p>${item.description}</p>
                    </div>
                `).join('')}
            </div>
        `;

        this.shadowRoot.querySelectorAll(".menu-item").forEach(item => {
            item.addEventListener("click", (event) => {
                const route = event.currentTarget.getAttribute("data-route");
                window.router.loadRoute(`/${route}`); 
            });
        });
    }
}

customElements.define('main-menu-page', MainMenuPage);

export default MainMenuPage;
