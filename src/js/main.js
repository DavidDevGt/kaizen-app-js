/** Core */
import AppLayout from './web-components/app-layout';
import requestPermissions from "./pluginsPermissions";

/** Import pages */
import MainMenuPage from './pages/mainMenuPage';
import TasksPage from './pages/taskPage';
import SettingsPage from './pages/settingsPage';
import PDFReaderPage from './pages/pdfReaderPage';

/** Import routes */
import { router } from './router';

router.addRoute('/', () => {
    return document.createElement('main-menu-page');
});

router.addRoute('/tasks', () => {
    return document.createElement('tasks-page');
});

router.addRoute('/settings', () => {
    return document.createElement('settings-page');
});

router.addRoute('/pdf-reader', () => {
    return document.createElement('pdf-reader-page');
});

router.init();

window.router = router;

// Custom event to navigate between pages
document.addEventListener("navigate", (event) => {
    const page = event.detail.page;
    router.loadRoute(`/${page}`);
});

requestPermissions(); // Request permissions on app install
