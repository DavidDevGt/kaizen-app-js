import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

class CameraService {
    /**
     * Abre la aplicacion de camara del dispositivo y permite al usuario tomar una
     * fotografia. La imagen se devuelve como una URL. Si el usuario cancela la
     * accion, se devuelve null.
     * @returns {Promise<string>} URL de la imagen tomada o null si se cancela.
     */
    static async takePhoto() {
        try {
            const photo = await Camera.getPhoto(
                {
                    quality: 90,
                    allowEditing: false,
                    resultType: CameraResultType.Uri,
                    source: CameraSource.Camera,
                }
            );
            return photo.webPath; // URL
            
        } catch (error) {
            console.warn('El usuario cancelo la captura: ',error);
            return null;
        }
    }

    /**
     * Abre la galeria de imagenes del dispositivo y permite al usuario seleccionar
     * una imagen. La imagen se devuelve como una URL. Si el usuario cancela la
     * accion, se devuelve null.
     * @returns {Promise<string>} URL de la imagen seleccionada o null si se cancela.
     */
    static async takePhotoGallery() {
        try {
            const photo = await Camera.getPhoto(
                {
                    quality: 90,
                    allowEditing: false,
                    resultType: CameraResultType.Uri,
                    source: CameraSource.Photos,
                }
            );
            return photo.webPath; // URL
        } catch (error) {
            console.warn('El usuario cancelo la subida: ',error);
            return null;
        }
    }
}


export default CameraService;