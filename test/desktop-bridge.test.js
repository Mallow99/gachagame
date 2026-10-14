// Verify actual main-process lifecycle code without pretending to run macOS.
import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

async function desktop(){
 const windows=[],timers=new Map();let nextTimer=0,completedQuits=0;
 const app=new EventEmitter();app.whenReady=()=>Promise.resolve();app.dock={hide(){}};
 app.quit=()=>{const e={prevented:false,preventDefault(){this.prevented=true;}};app.emit('before-quit',e);if(!e.prevented){completedQuits++;app.emit('will-quit');}};
 class BrowserWindow extends EventEmitter{
  constructor(options){super();this.options=options;this.visible=options.show!==false;this.webContents=new EventEmitter();this.webContents.messages=[];this.webContents.send=(channel,payload)=>this.webContents.messages.push({channel,payload});windows.push(this);}
  loadFile(){}setAlwaysOnTop(){}setVisibleOnAllWorkspaces(){}setIgnoreMouseEvents(){}focus(){}isDestroyed(){return false;}getBounds(){return this.options;}setBounds(b){Object.assign(this.options,b);}show(){this.visible=true;}showInactive(){this.visible=true;}hide(){this.visible=false;}isVisible(){return this.visible;}
 }
 const ipcMain=new EventEmitter(),screen=new EventEmitter();screen.getPrimaryDisplay=()=>({workArea:{x:0,y:0,width:1440,height:900}});screen.getCursorScreenPoint=()=>({x:0,y:0});
 class Tray extends EventEmitter{setToolTip(){}setContextMenu(){}}
 const electron={app,BrowserWindow,ipcMain,screen,Tray,Menu:{buildFromTemplate:x=>x},nativeImage:{createFromPath:()=>({setTemplateImage(){}})},globalShortcut:{register(){},unregisterAll(){}}};
 const script=fs.readFileSync(new URL('../electron/main.js',import.meta.url),'utf8');
 vm.runInNewContext(script,{require:name=>name==='electron'?electron:path,__dirname:fileURLToPath(new URL('../electron',import.meta.url)),Buffer,
  setTimeout:fn=>{const id=++nextTimer;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id),setInterval:()=>++nextTimer,clearInterval(){} });
 await Promise.resolve();
 const [strip,manager]=windows;
 return{app,ipcMain,strip,manager,timers,quits:()=>completedQuits,request:()=>strip.webContents.messages.findLast(m=>m.channel==='save-now').payload,
  acknowledge:result=>ipcMain.emit('save-complete',{sender:strip.webContents},result)};
}
test('Quit & Save waits for the matching successful renderer acknowledgment',async()=>{
 const d=await desktop();d.app.quit();const request=d.request();assert.equal(d.quits(),0);d.acknowledge({ok:true,requestId:request.requestId-1});assert.equal(d.quits(),0);d.acknowledge({ok:true,...request});assert.equal(d.quits(),1);assert.equal(d.timers.size,0);
});
test('a write failure or missing acknowledgment cancels quit and opens export recovery',async()=>{
 const failed=await desktop();failed.app.quit();failed.acknowledge({ok:false,...failed.request()});assert.equal(failed.quits(),0);assert.equal(failed.app.isQuitting,false);assert.equal(failed.manager.isVisible(),true);
 const timeout=await desktop();timeout.app.quit();for(const fn of timeout.timers.values())fn();assert.equal(timeout.quits(),0);assert.equal(timeout.app.isQuitting,false);assert.ok(timeout.manager.webContents.messages.some(m=>m.channel==='game-toast'&&m.payload.includes('export a backup')));
});
test('startup respects hidden saves and the strip close action uses the save path',async()=>{
 for(const hidden of [true,false]){const d=await desktop();d.ipcMain.emit('game-state',{sender:d.strip.webContents},{state:{profile:{stripHidden:hidden}},paused:false,battle:null});assert.equal(d.strip.isVisible(),!hidden);}
 const d=await desktop();let prevented=false;d.strip.emit('close',{preventDefault(){prevented=true;}});assert.equal(prevented,true);assert.ok(d.request().requestId);assert.equal(d.quits(),0);
});
