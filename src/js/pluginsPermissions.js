import { Camera } from "@capacitor/camera";
import { Filesystem } from "@capacitor/filesystem";
import { LocalNotifications } from "@capacitor/local-notifications";
import PreferencesService from './services/preferencesService';

const PERMISSIONS_REQUESTED_KEY = "permissionsRequested";

/**
 * Verifica y solicita permisos necesarios SOLO la primera vez que se instala la app.
 */
async function requestPermissions() {
    try {
        const value = await PreferencesService.getPreference(PERMISSIONS_REQUESTED_KEY);

        if (value === "true") {
            console.log("🔍 Los permisos ya fueron solicitados previamente. No se volverán a pedir.");
            return;
        }
        const cameraStatus = await Camera.checkPermissions();
        if (cameraStatus.camera !== "granted") {
            console.log("📸 Solicitando permiso de cámara...");
            await Camera.requestPermissions();
        }

        const fileStatus = await Filesystem.checkPermissions();
        if (fileStatus.publicStorage !== "granted") {
            console.log("📂 Solicitando permiso de almacenamiento...");
            await Filesystem.requestPermissions();
        }

        const notifStatus = await LocalNotifications.checkPermissions();
        if (notifStatus.display !== "granted") {
            console.log("🔔 Solicitando permiso de notificaciones...");
            await LocalNotifications.requestPermissions();
        }

        await PreferencesService.setPreference(PERMISSIONS_REQUESTED_KEY, "true");

        console.log("✅ Permisos gestionados correctamente.");
    } catch (error) {
        console.error("❌ Error al gestionar permisos:", error);
    }
}

export default requestPermissions;