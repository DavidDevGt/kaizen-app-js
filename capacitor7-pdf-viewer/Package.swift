// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Capacitor7PdfViewer",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "Capacitor7PdfViewer",
            targets: ["PDFViewerPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "PDFViewerPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/PDFViewerPlugin"),
        .testTarget(
            name: "PDFViewerPluginTests",
            dependencies: ["PDFViewerPlugin"],
            path: "ios/Tests/PDFViewerPluginTests")
    ]
)