import manifest from '../../assets/sprites/v1/manifest.mjs';
export class SpriteBank {
  constructor(){this.definitions={};this.images=new Map();this.ready=this.loadManifest();}
  async loadManifest(){this.definitions=manifest;}
  load(key){if(this.images.has(key))return this.images.get(key);const d=this.definitions[key];if(!d)return null;const im=new Image();im.src=d.url;this.images.set(key,im);return im;}
  draw(ctx,key,x,y,height,options={}){
    const d=this.definitions[key],im=this.load(key);if(!d||!im?.complete||!im.naturalWidth)return false;
    const clip=d.clips[options.state]||d.clips.idle,index=clip[Math.floor(options.frame??(options.time||0)*d.fps)%clip.length]||0;
    const [sx,sy,w,h]=d.frames[index],scale=height/d.nativeHeight;
    ctx.save();ctx.translate(Math.round(x),Math.round(y));
    const flip=(options.direction||1)===(d.facing==='right'?1:-1)?1:-1;
    ctx.rotate(options.rotation||0);ctx.scale(flip*(options.scaleX||1),options.scaleY||1);ctx.globalAlpha=options.alpha??1;
    if(options.tint)ctx.filter=options.tint;ctx.imageSmoothingEnabled=false;
    ctx.drawImage(im,sx,sy,w,h,-d.pivot[0]*scale,-d.pivot[1]*scale,w*scale,h*scale);ctx.restore();return true;
  }
}
export const spriteIcon = key => `assets/sprites/v1/${key}-icon.png`;
