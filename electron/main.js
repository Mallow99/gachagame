// The strip owns the simulation/save. The Manual is an observer and sends
// bounded commands, so opening it cannot destroy a battle or race save writes.
const {app,BrowserWindow,globalShortcut,ipcMain,Menu,nativeImage,screen,Tray}=require('electron');
const path=require('path');
// Optional isolated QA/development profile; normal launches keep their save.
if(process.env.POCKET_GACHA_PROFILE_DIR){const profilePath=path.resolve(process.env.POCKET_GACHA_PROFILE_DIR);require('fs').mkdirSync(profilePath,{recursive:true});app.setPath('userData',profilePath);}
const STRIP_HEIGHT=170,MANAGER_WIDTH=360,MANAGER_HEIGHT=600;
const COMMANDS=new Set(['save','train','trainFive','toggleParty','replaceParty','setRow','equip','equipAssist','fighterPolicy','applyNote','pull','finishReveal','switchWorld','choosePreset','endlessPreset','start','pause','auto','claimOrder','exchange','setting','audio','importSave']);
let strip,manager,tray,cachedState=null,interactiveRects=[],ignoringMouse=false,clickTimer,saveRequested=false,saveFinished=false,quitTimer,saveRequestId=0,bootVisibilityApplied=false;
const baseOptions={frame:false,transparent:true,backgroundColor:'#00000000',resizable:false,maximizable:false,fullscreenable:false,hasShadow:false,skipTaskbar:true,
  webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,backgroundThrottling:false,autoplayPolicy:'no-user-gesture-required'}};
function workArea(){return screen.getPrimaryDisplay().workArea;}
function sendHidden(hidden){strip?.webContents.send('game-command',{name:'setting',args:['stripHidden',hidden]});}
function showStrip(){if(!strip)return;sendHidden(false);strip.showInactive();manager?.hide();}
function hideStrip(){if(!strip)return;sendHidden(true);strip.hide();}
function toggleStrip(){if(strip?.isVisible())hideStrip();else showStrip();}
function showManager(){if(!manager)return;manager.show();manager.focus();if(cachedState)manager.webContents.send('game-state',cachedState);}
function createWindows(){
  const area=workArea();strip=new BrowserWindow({...baseOptions,x:area.x,y:area.y+area.height-STRIP_HEIGHT,width:area.width,height:STRIP_HEIGHT,title:'Pocket Gacha · Strip',alwaysOnTop:true,show:false});
  manager=new BrowserWindow({...baseOptions,x:area.x+area.width-MANAGER_WIDTH-24,y:area.y+area.height-MANAGER_HEIGHT-24,width:MANAGER_WIDTH,height:MANAGER_HEIGHT,title:'Pocket Field Manual',show:false});
  strip.setAlwaysOnTop(true,'floating');strip.setVisibleOnAllWorkspaces(true,{visibleOnFullScreen:false});
  manager.setAlwaysOnTop(true,'floating');manager.setVisibleOnAllWorkspaces(true,{visibleOnFullScreen:false});
  strip.loadFile(path.join(__dirname,'..','strip.html'));manager.loadFile(path.join(__dirname,'..','index.html'));
  manager.on('close',e=>{if(!saveFinished){e.preventDefault();manager.hide();}});
  strip.on('close',e=>{if(!saveFinished){e.preventDefault();app.quit();}});
  const icon=nativeImage.createFromPath(path.join(__dirname,'..','assets','ui','tray-star.png'));
  icon.setTemplateImage(true);tray=new Tray(icon);tray.setToolTip('Pocket Gacha');tray.on('click',toggleStrip);
  tray.setContextMenu(Menu.buildFromTemplate([{label:'Show / Hide Strip',click:toggleStrip},{label:'Open Field Manual',click:showManager},{type:'separator'},{label:'Quit & Save',click:()=>app.quit()}]));
  globalShortcut.register('CommandOrControl+Shift+G',toggleStrip);app.dock?.hide();clickTimer=setInterval(updateClickThrough,50);
  screen.on('display-metrics-changed',()=>{const area=workArea();strip.setBounds({x:area.x,y:area.y+area.height-STRIP_HEIGHT,width:area.width,height:STRIP_HEIGHT});});
}
function updateClickThrough(){if(!strip||!strip.isVisible())return;
  const cursor=screen.getCursorScreenPoint(),bounds=strip.getBounds(),x=cursor.x-bounds.x,y=cursor.y-bounds.y;
  const inside=interactiveRects.some(r=>x>=r.x&&x<=r.x+r.width&&y>=r.y&&y<=r.y+r.height);
  const ignore=!inside;if(ignore!==ignoringMouse){ignoringMouse=ignore;strip.setIgnoreMouseEvents(ignore,{forward:true});}
}
ipcMain.on('open-manager',showManager);ipcMain.on('open-strip',showStrip);ipcMain.on('hide-strip',hideStrip);ipcMain.on('quit',()=>app.quit());
ipcMain.on('strip-interactive-rects',(event,rects)=>{if(event.sender!==strip?.webContents)return;
  if(Array.isArray(rects))interactiveRects=rects.slice(0,20).filter(r=>r&&[r.x,r.y,r.width,r.height].every(Number.isFinite));});
ipcMain.on('game-command',(event,command)=>{
  if(event.sender!==manager?.webContents||!COMMANDS.has(command?.name)||!Array.isArray(command.args))return;
  strip?.webContents.send('game-command',command);
});
ipcMain.on('game-state',(event,payload)=>{if(event.sender!==strip?.webContents)return;cachedState=payload;
  if(!bootVisibilityApplied){bootVisibilityApplied=true;if(!payload.state.profile.stripHidden)strip.showInactive();}
  if(manager?.isVisible())manager.webContents.send('game-state',payload);
  const b=payload.battle;tray?.setToolTip(`Pocket Gacha · ${payload.paused?'Paused':b&&!b.done?'Fighting':'Ready'}`);
});
ipcMain.on('request-state',event=>{if(event.sender===manager?.webContents&&cachedState)manager.webContents.send('game-state',cachedState);});
ipcMain.on('inspect-fighter',(event,id)=>{if(event.sender!==strip?.webContents||typeof id!=='string')return;showManager();manager?.webContents.send('inspect-fighter',id);});
ipcMain.on('game-toast',(event,message)=>{if(event.sender===strip?.webContents&&typeof message==='string')manager?.webContents.send('game-toast',message);});
ipcMain.on('save-complete',(event,result)=>{if(event.sender!==strip?.webContents||!saveRequested||result?.requestId!==saveRequestId)return;clearTimeout(quitTimer);
  if(!result?.ok){saveRequested=false;app.isQuitting=false;showManager();manager?.webContents.send('game-toast','The save could not be written. Export a backup in Manual → Settings before closing.');return;}
  saveFinished=true;app.quit();
});
app.whenReady().then(createWindows);app.on('before-quit',event=>{
  app.isQuitting=true;if(saveFinished||!strip||strip.isDestroyed())return;
  event.preventDefault();if(saveRequested)return;saveRequested=true;strip.webContents.send('save-now',{requestId:++saveRequestId});
  quitTimer=setTimeout(()=>{saveRequested=false;app.isQuitting=false;showManager();manager?.webContents.send('game-toast','The game did not answer the save request. Try saving again or export a backup in Manual → Settings.');},2000);
});
app.on('will-quit',()=>{globalShortcut.unregisterAll();clearInterval(clickTimer);clearTimeout(quitTimer);});app.on('window-all-closed',()=>app.quit());
