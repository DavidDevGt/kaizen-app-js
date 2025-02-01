import { FilePicker } from "@capawesome/capacitor-file-picker";

class PDFService {
    static async pickPDF() {
        try {
            const typeDoc = "application/pdf";
            const limit = 1;
            const result = await FilePicker.pickFiles({
                type: [typeDoc],
                limit,
                readData: true,
            });

            if (result && result.files && result.files.length > 0) {
                return result.files[0];
            }
            return null;
        } catch (error) {
            console.error("Error al seleccionar el PDF:", error);
            return null;
        }
    }
}

export default PDFService;