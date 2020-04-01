// Inside vue.config.js
module.exports = {
  // ...other vue-cli plugin options...
  pwa: {
    name: 'Trinkspiel',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    // configure the workbox plugin
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'public/service-worker.js'
      // ...other Workbox options...
    },
    workboxPluginMode: 'InjectManifest',
    manifestOptions: {
      orientation: 'landscape',
      display: 'fullscreen'
    }
  }
};
