class NotebookPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        const CONFIG = {
            limit: 10,
            noteTypes: ['text', 'image', 'audio'],
            defaultTitle: 'Nueva Nota',
            defaultContent: '',
            storageKey: 'notebook_notes',
            noteStructure: {
                title: '',
                content: '',
                type: 'text',
                timestamp: Date.now(),
            },
            colors: ['#3F51B5', '#009688', '#DBDA85', '#9CB5C1'],
            
        };


    }
}