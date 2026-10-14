"""Render the original SM64 cap mesh with the native metal environment map.

Run: blender -b -t 2 --python tools/art/render-metal-cap.py
This is a rendered source-model illustration, not an official artwork rip.
The plain cap geometry is preserved. Studio lighting and an approximate metal
material make the source shape readable; the native environment map supplies
a slight tint. This does not reproduce the N64's renderer exactly.
"""
from pathlib import Path
import zipfile,tempfile,json,hashlib
import bpy,bmesh
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2]
source=ROOT/'assets/models/metal-cap/source'
work=Path(tempfile.mkdtemp(prefix='pocket-cap-'))
with zipfile.ZipFile(source/'cap.zip')as archive:archive.extractall(work)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.fbx(filepath=str(work/"Mario's Cap.fbx"))
texture=bpy.data.images.load(str(source/'mario_metal.png'))
material=bpy.data.materials.new('Original SM64 metal environment');material.use_nodes=True
nodes=material.node_tree.nodes;nodes.clear();links=material.node_tree.links
coordinate=nodes.new('ShaderNodeNewGeometry');camera_normal=nodes.new('ShaderNodeVectorTransform');camera_normal.vector_type='NORMAL';camera_normal.convert_from='WORLD';camera_normal.convert_to='CAMERA';links.new(coordinate.outputs['Normal'],camera_normal.inputs[0])
separate=nodes.new('ShaderNodeSeparateXYZ');links.new(camera_normal.outputs[0],separate.inputs[0])
combine=nodes.new('ShaderNodeCombineXYZ')
for axis,input_name in [('X','X'),('Y','Y')]:
 scale=nodes.new('ShaderNodeMath');scale.operation='MULTIPLY_ADD';scale.inputs[1].default_value=.5;scale.inputs[2].default_value=.5
 links.new(separate.outputs[axis],scale.inputs[0]);links.new(scale.outputs[0],combine.inputs[input_name])
image=nodes.new('ShaderNodeTexImage');image.image=texture;image.extension='EXTEND';links.new(combine.outputs[0],image.inputs['Vector'])
tint=nodes.new('ShaderNodeMixRGB');tint.inputs[0].default_value=.04;tint.inputs[1].default_value=(.62,.68,.78,1);links.new(image.outputs['Color'],tint.inputs[2])
logo=nodes.new('ShaderNodeTexImage');logo.image=bpy.data.images.load(str(work/'mario_cap_logo.rgba16.png'));logo.extension='CLIP'
gray=nodes.new('ShaderNodeRGBToBW');links.new(logo.outputs['Color'],gray.inputs[0]);tone=nodes.new('ShaderNodeMath');tone.operation='MULTIPLY_ADD';tone.inputs[1].default_value=.7;tone.inputs[2].default_value=.22;links.new(gray.outputs[0],tone.inputs[0])
emblem=nodes.new('ShaderNodeMixRGB');links.new(logo.outputs['Alpha'],emblem.inputs[0]);links.new(tint.outputs[0],emblem.inputs[1]);links.new(tone.outputs[0],emblem.inputs[2])
surface=nodes.new('ShaderNodeBsdfPrincipled');surface.inputs['Metallic'].default_value=1;surface.inputs['Roughness'].default_value=.24;links.new(emblem.outputs[0],surface.inputs['Base Color'])
output=nodes.new('ShaderNodeOutputMaterial');links.new(surface.outputs[0],output.inputs['Surface'])
for obj in bpy.context.scene.objects:
 if obj.type=='MESH'and len(obj.data.vertices):
  # The rip contains optional Wing Cap planes in the same mesh. They are not
  # part of the plain Metal Cap and must not become opaque chrome rectangles.
  wing_slots={i for i,m in enumerate(obj.data.materials)if m and 'wing'in m.name.lower()}
  mesh=bmesh.new();mesh.from_mesh(obj.data);bmesh.ops.delete(mesh,geom=[face for face in mesh.faces if face.material_index in wing_slots],context='FACES_ONLY');mesh.to_mesh(obj.data);mesh.free()
  for i in range(len(obj.data.materials)):obj.data.materials[i]=material
  # N64 environment mapping interpolates vertex normals across the original
  # polygons. No subdivision, geometry editing or invented texture is used.
  for polygon in obj.data.polygons:polygon.use_smooth=True
scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE_NEXT';scene.render.resolution_x=896;scene.render.resolution_y=720;scene.render.resolution_percentage=100
scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.view_settings.view_transform='Standard'
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.7,.75,.85,1);scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.5
for location,power,size in [((1,3,6),450,5),((-4,-1,4),250,4),((3,-4,2),180,3)]:
 bpy.ops.object.light_add(type='AREA',location=location);light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=size;light.rotation_euler=(Vector((0,0,1))-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(5,-10,5));camera=bpy.context.object;camera.rotation_euler=(Vector((0,0,1.15))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=4.3;scene.camera=camera
scene.render.filepath=str(ROOT/'assets/portraits/supply/metal-cap-render.png');bpy.ops.render.render(write_still=True)
registry=ROOT/'assets/portraits/supply/INTAKE.json'
if registry.exists():
 records=json.loads(registry.read_text());render=Path(scene.render.filepath)
 for record in records:
  if record.get('sourceType')=='rendered-source-model'and record['id']=='metal-cap':
   record['sha256']=hashlib.sha256(render.read_bytes()).hexdigest();record['bytes']=render.stat().st_size;record['dimensions']=[scene.render.resolution_x,scene.render.resolution_y]
 registry.write_text(json.dumps(records,indent=2)+'\n')
print('Rendered original cap geometry with studio metal shading and native texture tint.')
