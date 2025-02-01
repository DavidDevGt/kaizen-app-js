package com.daviddevgt.plugins.pdfviewer;

import android.content.Context;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.rajat.pdfviewer.PdfViewerActivity;
import com.rajat.pdfviewer.SaveTo;

@CapacitorPlugin(name = "PDFViewer")
public class PDFViewerPlugin extends Plugin {

    private PDFViewer implementation = new PDFViewer();

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", implementation.echo(value));
        call.resolve(ret);
    }

    @PluginMethod
    public void openPDF(PluginCall call) {
        String url = call.getString("url");

        if (url == null) {
            call.reject("No URL Provided");
        }

        try {
            PdfViewerActivity.launchPdfFromUrl(
                getContext(),
                url,
                SaveTo.NONE,
                false
            );
            call.resolve();
        } catch (Exception e) {
            // TODO: handle exception
            call.reject("Error opening PDF: " + e.getMessage());
        }
        
    }
}
