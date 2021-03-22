import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ipcAPI', {
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
  sendSync: (channel: string, ...args: any[]) =>
    ipcRenderer.sendSync(channel, ...args),
});
