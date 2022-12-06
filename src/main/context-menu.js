const { Menu, MenuItem } = require('electron');

const menu = new Menu();
menu.append(new MenuItem({ role: 'close' }))
menu.append(new MenuItem({
  label: 'Reload',
  accelerator: 'Ctrl+R',
  click (item, focusedWindow) {
    if (focusedWindow) focusedWindow.reload()
  }
}))
menu.append(new MenuItem({ 
  label: 'Clear Cache',
  click (item, focusedWindow) {
    if (focusedWindow) {
      focusedWindow.webContents.session.clearCache().then(() => console.log('clear Cache !')).catch((reject) => console.error(reject));
    }
  }
}))
menu.append(new MenuItem({
  label: 'Toggle Developer Tools',
  accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
  click (item, focusedWindow) {
    if (focusedWindow) focusedWindow.webContents.toggleDevTools()
  }
}))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ role: 'resetzoom' }))
menu.append(new MenuItem({ role: 'zoomin' }))
menu.append(new MenuItem({ role: 'zoomout' }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ role: 'togglefullscreen' }));

module.exports = menu;