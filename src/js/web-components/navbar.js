class Navbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const title = this.getAttribute('title') || 'KaizenApp';

        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400&display=swap');
                .navbar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #0C4DA3, #0683FF);
                    padding: 15px 25px;
                    color: white;
                    font-size: 24px;
                    font-weight: 400;
                    letter-spacing: 1px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    border-radius: 0 0 5px 5px;
                }

                .title {
                    letter-spacing: 1px;
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <nav class="navbar">
                <div class="title">${title}</div>
            </nav>
        `;
    }
}

customElements.define('app-navbar', Navbar);

export default Navbar;
