/** Core */
import AppLayout from './web-components/app-layout';
import { router } from './router';
import requestPermissions from "./pluginsPermissions";

/** Import pages */
import MainMenuPage from './pages/mainMenuPage';
import TasksPage from './pages/taskManagerPage';
import SettingsPage from './pages/settingsPage';


/** Define routes */
router.addRoute('/', () => {
    return document.createElement('main-menu-page');
});

router.addRoute('/tasks', () => {
    return document.createElement('tasks-page');
});

router.addRoute('/settings', () => {
    return document.createElement('settings-page');
});

router.init();

window.router = router;

// Custom event to navigate between pages
document.addEventListener("navigate", (event) => {
    const page = event.detail.page;
    router.loadRoute(`/${page}`);
});

requestPermissions(); // Request permissions on app install