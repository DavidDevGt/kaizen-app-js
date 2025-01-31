import Navbar from './navbar.js';

class AppLayout extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .layout {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                }
                .content {
                    flex-grow: 1;
                    padding: 20px;
                    overflow-y: auto;
                }
            </style>

            <div class="layout">
                <app-navbar title="KaizenApp"></app-navbar>
                <div class="content">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('app-layout', AppLayout);

export default AppLayout;