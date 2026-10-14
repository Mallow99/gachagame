// Shared by collision selection and presentation. Spark surrounds its owner;
// a breath/beam projects forward from the owner's facing direction.
export const isFieldBeam=actor=>actor.copy==='spark'||actor.spriteKey==='sparky'||actor.definition?.presentation?.effectMotif==='spark';
export function beamReach(actor,ability){return(isFieldBeam(actor)?110:460)*(ability.areaScale||1);}
export function insideBeam(source,target,ability){
  return Math.abs(target.x-source.x)<beamReach(source,ability)&&(isFieldBeam(source)||Math.sign(target.x-source.x)===source.direction);
}
