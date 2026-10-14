(async()=>{
 const status=document.querySelector('#status'),loading=document.querySelector('#loading');let app,model;
 try{
  const container=document.querySelector('.render');
  app=new PIXI.Application({view:document.querySelector('canvas'),resizeTo:container,backgroundAlpha:0,antialias:true,resolution:Math.min(devicePixelRatio,1.5),autoDensity:true,autoStart:false});
  model=await PIXI.live2d.Live2DModel.from('./Haru/Haru.model3.json',{autoInteract:false,autoUpdate:false});
  model.anchor.set(.5,.5);app.stage.addChild(model);
  function resize(){const bounds=model.getLocalBounds();model.scale.set(Math.min(app.screen.width*.78/bounds.width,app.screen.height*.95/bounds.height));model.position.set(app.screen.width/2,app.screen.height/2);app.renderer.render(app.stage);}
  const turn=document.querySelector('#turn');
  model.internalModel.on('beforeModelUpdate',()=>{model.internalModel.coreModel.setParameterValueById('ParamAngleX',Number(turn.value));});
  const update=()=>model.update(app.ticker.deltaMS);
  app.ticker.add(update);new ResizeObserver(resize).observe(container);resize();
  let motion=!matchMedia('(prefers-reduced-motion: reduce)').matches,expression=0;
  const pause=document.querySelector('#pause');
  function setMotion(value){motion=value;pause.textContent=motion?'Pause motion':'Resume motion';pause.setAttribute('aria-pressed',String(!motion));if(motion&&!document.hidden)app.start();else{app.stop();app.renderer.render(app.stage);}}
  pause.onclick=()=>setMotion(!motion);
  document.querySelector('#gesture').onclick=()=>{model.motion('TapBody',0,3);setMotion(true);};
  document.querySelector('#expression').onclick=()=>{expression=expression%8+1;model.expression('F0'+expression);if(!motion){model.update(50);app.renderer.render(app.stage);}};
  turn.oninput=()=>{if(!motion){model.update(16);app.renderer.render(app.stage);}};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)app.stop();else if(motion)app.start();});
  for(const element of document.querySelectorAll('button,input'))element.disabled=false;
  loading.style.display='none';setMotion(motion);
  window.cubismReview={ready:true,model:'Official Haru sample',core:Live2DCubismCore.Version.csmGetVersion(),parameters:model.internalModel.coreModel.getParameterCount(),drawables:model.internalModel.coreModel.getDrawableCount(),setMotion,get motion(){return motion;},getParameter(id){return model.internalModel.coreModel.getParameterValueById(id);},destroy(){app.stop();model.destroy();app.destroy(true);}};
 }catch(error){console.error(error);loading.textContent='Cubism could not start in this browser.';status.textContent=error.message;app?.stop();window.cubismReview={ready:false,error:error.message,stack:error.stack};}
})();
