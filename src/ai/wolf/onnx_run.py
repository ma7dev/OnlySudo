import argparse
import os
import time
import onnx
import torch
import requests
from io import BytesIO
from PIL import Image, ImageOps
import cv2
from torchvision import transforms
from torchvision.transforms.functional import to_tensor, to_pil_image
import onnxruntime as ort
import numpy as np

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', type=str, default='')
    parser.add_argument('--filename', type=str, default=f"{time.time()}.jpg")
    args = parser.parse_args()

    project_path = "/home/alotaima/Projects/side/onlysudo/src/ai/anime"
    args.outdir = '/src/server/public/ai/anime'

    root_path = '/'.join(os.path.abspath(os.getcwd()).split('/')[:-1])
    output_path = f"{root_path}{args.outdir}/{args.filename}"

    if args.url == '':
        print('Need url or streamer name!')
        exit()
    
    args.size = 1024
    side_by_side = False
    device = "cuda"

    print('start')
    # # Load the ONNX model
    # model = onnx.load("animegan2_generator.onnx")
    # # Check that the model is well formed
    # onnx.checker.check_model(model)
    ort_session = ort.InferenceSession("animegan2_generator.onnx")

    response = requests.get(args.url, stream = True)
    img = Image.open(BytesIO(response.content)).convert("RGB")
    img = ImageOps.fit(img, (args.size, args.size), centering=(0.5, 0.5))

    w, h = img.size
    s = min(w, h)
    img = img.crop(((w - s) // 2, (h - s) // 2, (w + s) // 2, (h + s) // 2))
    img = img.resize((args.size, args.size), Image.LANCZOS)

    input = to_tensor(img).unsqueeze(0) * 2 - 1

    output = ort_session.run(
        None,
        {"actual_input_1": input.cpu().detach().numpy()},
    )[0]
    output = torch.tensor(output)[0]

    if side_by_side:
        output = torch.cat([input[0], output], dim=2)

    output = (output * 0.5 + 0.5).clip(0, 1)

    out = to_pil_image(output)

    out = np.concatenate([img, out], axis=1)

    cv2.imwrite(output_path, cv2.cvtColor(out, cv2.COLOR_BGR2RGB))
        
    print(f"Done! {output_path}")