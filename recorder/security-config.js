const { app } = require('electron');

app.on('web-contents-created', (event, contents) => {
    contents.on('will-attach-webview', (event, webPreferences, params) => {
        console.log("will-attach-webview triggered");
      // Strip away preload scripts if unused or verify their location is legitimate
      delete webPreferences.preload
      delete webPreferences.preloadURL
  
      // Disable Node.js integration
      webPreferences.nodeIntegration = false
  
      // Verify URL being loaded
      if (!params.src.startsWith('https://example.com/')) {
        event.preventDefault()
        console.log(`Blocked access to untrusted website: ${params.src}`)
      }
    });

    // Prevent navigation to untrusted websites
    contents.on('will-navigate', (event, navigationUrl) => {
        console.log("will-navigate triggered");

        const parsedUrl = new URL(navigationUrl)
    
        if (parsedUrl.origin !== 'https://example.com') {
          event.preventDefault()
        }
    });

    // TODO: Add controll to the windows that are allowed to open
})