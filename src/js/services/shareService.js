import { Share } from "@capacitor/share";

class ShareService {
    /**
     * 🔄 Verifica si el dispositivo soporta la función de compartir.
     * @returns {Promise<boolean>} - `true` si es compatible, `false` si no.
     */
    static async canShare() {
        try {
            const { value } = await Share.canShare();
            return value;
        } catch (error) {
            console.error("Error al verificar compatibilidad de compartir:", error);
            return false;
        }
    }

    /**
     * 📤 Comparte contenido con otras aplicaciones.
     * @param {Object} options - Opciones de contenido a compartir.
     * @param {string} [options.title] - Título del contenido (ej. Asunto del correo).
     * @param {string} [options.text] - Texto del contenido a compartir.
     * @param {string} [options.url] - URL a compartir (puede ser un enlace o un archivo local).
     * @param {string[]} [options.files] - Lista de archivos a compartir (solo iOS/Android).
     * @param {string} [options.dialogTitle] - Título del diálogo de compartir (solo Android).
     * @returns {Promise<boolean>} - `true` si se compartió correctamente, `false` si hubo un error.
     */
    static async share({ title, text, url, files, dialogTitle }) {
        try {
            const canShare = await this.canShare();
            if (!canShare) {
                console.warn("El dispositivo no soporta compartir contenido.");
                return false;
            }

            const shareOptions = {
                ...(title && { title }),
                ...(text && { text }),
                ...(url && { url }),
                ...(files && files.length > 0 && { files }),
                ...(dialogTitle && { dialogTitle }),
            };

            const result = await Share.share(shareOptions);
            console.log("Compartido con éxito:", result);
            return true;
        } catch (error) {
            console.error("Error al compartir:", error);
            return false;
        }
    }

    /**
     * 📸 Comparte una imagen tomada con la cámara.
     * @param {string} imagePath - Ruta de la imagen tomada.
     * @returns {Promise<boolean>} - `true` si se compartió con éxito, `false` si hubo un error.
     */
    static async shareImage(imagePath) {
        if (!imagePath) {
            console.warn("No hay imagen para compartir.");
            return false;
        }
        return await this.share({ url: imagePath });
    }

    /**
     * 📂 Comparte múltiples archivos.
     * @param {string[]} filePaths - Lista de rutas de archivos.
     * @returns {Promise<boolean>} - `true` si se compartieron con éxito, `false` si hubo un error.
     */
    static async shareMultipleFiles(filePaths) {
        if (!filePaths || filePaths.length === 0) {
            console.warn("No hay archivos para compartir.");
            return false;
        }
        return await this.share({ files: filePaths });
    }
}

export default ShareService;
