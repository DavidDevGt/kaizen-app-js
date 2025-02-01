import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

class FileService {
    static async writeFile(path, data) {
        try {
            await Filesystem.writeFile({
                path: path,
                data: data,
                directory: Directory.Data,
                encoding: Encoding.UTF8,
                recursive: true,
            });

            return true;
        } catch (error) {
            console.error('Error al escribir el archivo: ', error);
            return false;
        }
    }

    static async readFile(path) {
        try {
            const result = await Filesystem.readFile({
                path: path,
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            return result.data;
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            return null;
        }
    }


    static async deleteFile(path) {
        try {
            await Filesystem.deleteFile({
                path: path,
                directory: Directory.Data,
            });
            return true;
        } catch (error) {
            console.error("Error al eliminar el archivo:", error);
            return false;
        }
    }

    static async listFiles(directoryPath) {
        try {
            const result = await Filesystem.readdir({
                path: directoryPath,
                directory: Directory.Data,
            });
            return result.files.map(file => file.name);
        } catch (error) {
            console.error("Error al listar archivos:", error);
            return [];
        }
    }

    static async verifyPermissions() {
        try {
            const status = await Filesystem.checkPermissions();
            return status.publicStorage === "granted";
        } catch (error) {
            console.error("Error al verificar permisos:", error);
            return false;
        }
    }

    static async requestAccessToStorage() {
        try {
            const status = await Filesystem.requestPermissions();
            return status.publicStorage === "granted";
        } catch (error) {
            console.error("Error al solicitar permisos:", error);
            return false;
        }
    }

    static async createDirectory(directoryPath) {
        try {
            await Filesystem.mkdir({
                path: directoryPath,
                directory: Directory.Data,
            });
            return true;
        } catch (error) {
            console.error("Error al crear directorio:", error);
            return false;
        }
    }
}

export default FileService;