// Per-theater preloads: no global decoded-image cache. An arrival waits for
// decode, and Skip/close cancel the wait without changing committed results.
export function createRevealImageLoader(signal,{timeoutMs=8000}={}){
  const jobs=new Map();
  return function load(url){
    if(signal?.aborted)return Promise.resolve(false);
    if(!url)return Promise.resolve(true);
    if(jobs.has(url))return jobs.get(url).ready;
    const image=new Image();let settled=false;
    const ready=new Promise(resolve=>{
      const finish=value=>{if(settled)return;settled=true;clearTimeout(timer);image.onload=image.onerror=null;signal?.removeEventListener('abort',abort);resolve(value);};
      const abort=()=>finish(false),timer=setTimeout(()=>finish(false),timeoutMs);
      signal?.addEventListener('abort',abort,{once:true});
      image.onload=()=>{
        if(typeof image.decode==='function')image.decode().then(()=>finish(image.naturalWidth>0),()=>finish(false));
        else finish(image.naturalWidth>0);
      };
      image.onerror=()=>finish(false);image.src=url;
    });
    jobs.set(url,{image,ready});return ready;
  };
}
