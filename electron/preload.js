const {contextBridge,ipcRenderer}=require('electron');
const listen=(channel,callback)=>{const handler=(_event,payload)=>callback(payload);ipcRenderer.on(channel,handler);return()=>ipcRenderer.removeListener(channel,handler);};
contextBridge.exposeInMainWorld('desktop',{
  openManager:()=>ipcRenderer.send('open-manager'),openStrip:()=>ipcRenderer.send('open-strip'),hideStrip:()=>ipcRenderer.send('hide-strip'),quit:()=>ipcRenderer.send('quit'),
  reportInteractiveRects:rects=>ipcRenderer.send('strip-interactive-rects',rects),command:command=>ipcRenderer.send('game-command',command),
  publishState:state=>ipcRenderer.send('game-state',state),requestState:()=>ipcRenderer.send('request-state'),
  publishToast:message=>ipcRenderer.send('game-toast',message),
  saved:result=>ipcRenderer.send('save-complete',result),inspectFighter:id=>ipcRenderer.send('inspect-fighter',id),
  onCommand:callback=>listen('game-command',callback),onState:callback=>listen('game-state',callback),onToast:callback=>listen('game-toast',callback),onSave:callback=>listen('save-now',callback),
  onInspect:callback=>listen('inspect-fighter',callback),
});
