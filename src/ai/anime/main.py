import argparse
import os
import time
import torch

from PIL import Image
import requests
from io import BytesIO
import numpy as np
import cv2

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', type=str, default='')
    parser.add_argument('--filename', type=str, default=f"{time.time()}.jpg")
    args = parser.parse_args()

    project_path = "/home/alotaima/Projects/side/onlysudo/src/ai/anime"
    args.outdir = '/src/api/public/ai/anime'

    root_path = '/'.join(os.path.abspath(os.getcwd()).split('/')[:-2])
    output_path = f"{root_path}{args.outdir}/{args.filename}"

    if args.url == '':
        print('Need url or streamer name!')
        exit()

    size = 512

    model = torch.hub.load("bryandlee/animegan2-pytorch:main", "generator").eval()
    face2paint = torch.hub.load("bryandlee/animegan2-pytorch:main", "face2paint", size=size)
    
    response = requests.get(args.url, stream = True)
    img = Image.open(BytesIO(response.content)).convert("RGB")
    width, height = img.size
    max_ = max(width,height)
    if max_ > 1080:
        ratio = max_ / 1080
        img = img.resize((int(width*ratio),int(height*ratio)))

    out = face2paint(model, img)

    img = img.resize((size,size))
    
    out = np.concatenate([img, out], axis=1)
    cv2.imwrite(output_path, cv2.cvtColor(out, cv2.COLOR_BGR2RGB))
    print("Done!")