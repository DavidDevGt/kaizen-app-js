import { Preferences } from "@capacitor/preferences";

class PreferencesService {

    /**
     * Guarda un valor en las preferencias
     * @param {string} key - La clave para el valor
     * @param {string | object} value - El valor que se guardara
     * @returns {Promise<void>}
     */
    static async setPreference(key, value) {
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
        await Preferences.set({ key, value: stringValue });
    }

    /**
     * Recupera un valor de las preferencias
     * @param {string} key - La clave del valor que se recupera
     * @returns {Promise<string | null>}
     */
    static async getPreference(key) {
        const { value } = await Preferences.get({ key });
        return value ? JSON.parse(value) : null;
    }

    /**
     * Elimina un valor de las preferencia
     * @param {string} key - La clave del valor a eliminar
     * @returns {Promise<void>}
     */
    static async removePreference(key) {
        await Preferences.remove({ key });
    }

    /**
     * Limpia todas las preferencias.
     * @returns {Promise<void>}
     */
    static async clearData() {
        await Preferences.clear();
    }

    /**
     * Obtiene todas las claves guardadas en preferencias 
     * @returns {Promise<string[]>}
     */
    static async getAllData() {
        const { keys } = await Preferences.keys();
        return keys;
    }

}

export default PreferencesService;