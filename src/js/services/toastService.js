import { Toast } from "@capacitor/toast";

class ToastService {
    /**
     * 🍞 Muestra un Toast en la pantalla.
     * @param {string} text - Texto a mostrar en el Toast.
     * @param {'short' | 'long'} [duration='short'] - Duración del Toast: 'short' (2000ms) o 'long' (3500ms).
     * @param {'top' | 'center' | 'bottom'} [position='bottom'] - Posición del Toast en la pantalla.
     * @returns {Promise<void>}
     */
    static async showToast(text, duration = "short", position = "bottom") {
        try {
            await Toast.show({
                text,
                duration,
                position,
            });
        } catch (error) {
            console.error("Error al mostrar el Toast:", error);
        }
    }

    /**
     * ✅ Muestra un Toast de éxito.
     * @param {string} message - Mensaje a mostrar.
     */
    static async success(message) {
        await this.showToast(`✅ ${message}`, "short", "bottom");
    }

    /**
     * ⚠️ Muestra un Toast de advertencia.
     * @param {string} message - Mensaje a mostrar.
     */
    static async warning(message) {
        await this.showToast(`⚠️ ${message}`, "short", "center");
    }

    /**
     * ❌ Muestra un Toast de error.
     * @param {string} message - Mensaje a mostrar.
     */
    static async error(message) {
        await this.showToast(`❌ ${message}`, "long", "top");
    }
}

export default ToastService;
