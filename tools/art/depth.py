"""Make a depth map for a background image (used by the living-splash parallax).

Usage: depth.py MODEL.onnx IN_IMAGE OUT_DEPTH.png [width=1280]
Model: Depth Anything V2 Small, ONNX
  https://huggingface.co/onnx-community/depth-anything-v2-small/resolve/main/onnx/model.onnx
Needs: onnxruntime, numpy, pillow. Output: grayscale PNG, white = near.
"""
import sys

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter

model, src_path, out_path = sys.argv[1:4]
width = int(sys.argv[4]) if len(sys.argv) > 4 else 1280
src = Image.open(src_path).convert("RGB")
sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
H = 518
W = int(round(src.width * H / src.height / 14)) * 14
x = np.asarray(src.resize((W, H), Image.BICUBIC), dtype=np.float32) / 255.0
x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
x = x.transpose(2, 0, 1)[None].astype(np.float32)
d = sess.run(None, {sess.get_inputs()[0].name: x})[0].squeeze()
d = (d - d.min()) / (d.max() - d.min())
out = Image.fromarray((d * 255).astype(np.uint8))
out = out.resize((width, round(width * src.height / src.width)), Image.BICUBIC).filter(ImageFilter.GaussianBlur(2))
out.save(out_path)
print(out_path, out.size)
