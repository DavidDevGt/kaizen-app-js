class ExpensesPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const CONFIG = {
            timeFilters: ['day', 'week', 'month'],
            defaultTimeFilter: 'week',
            limit: 10,
            defaultCategoryFilter: 'all',
            storageKey: 'expenses_data',
            currencySymbol: 'Q',
        };
    }
}