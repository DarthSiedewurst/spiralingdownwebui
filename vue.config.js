// Inside vue.config.js
module.exports = {
  // ...other vue-cli plugin options...
  pwa: {
    name: "Spiraling Down",
    themeColor: "#a19f9e",
    msTileColor: "#e8e8e8",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    // configure the workbox plugin
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "public/service-worker.js"
      // ...other Workbox options...
    },
    workboxPluginMode: "InjectManifest",
    manifestOptions: {
      orientation: "landscape",
      display: "fullscreen"
    }
  }
};
