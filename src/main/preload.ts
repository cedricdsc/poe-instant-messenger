import { contextBridge, ipcRenderer } from 'electron';
import { IpcEvent } from './IpcEvent/IpcEvent';

export interface PreloadExposed {
  sendEvent: (event: IpcEvent) => void;
  onEvent: (cb: (data: IpcEvent) => void) => void;
}

const api: PreloadExposed = {
  sendEvent(event) {
    ipcRenderer.send(event.name, event.payload);
  },
  onEvent(cb) {
    ipcRenderer.on('named-event', (_e, data) => {
      cb(data);
    });
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);
