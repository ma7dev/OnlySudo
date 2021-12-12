import argparse
import os
import numpy as np
from skimage import io
from PIL import Image
import requests
from io import BytesIO
import numpy as np
import cv2
import time

from pyxelate import Pyx, Pal

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', type=str, default='')
    parser.add_argument('--filename', type=str, default=f"{time.time()}.jpg")
    parser.add_argument('--palette', type=int, default=7)
    args = parser.parse_args()

    project_path = "/home/alotaima/Projects/side/onlysudo/src/ai/pyxelate"
    args.outdir = '/src/api/public/ai/pixel'
    # args.outdir = '/api/public/ai/pixel'

    root_path = '/'.join(os.path.abspath(os.getcwd()).split('/')[:-2])
    output_path = f"{root_path}{args.outdir}/{args.filename}"
    
    if args.url == '':
        print('Need url or streamer name!')
        exit()

    scale = 14 

    response = requests.get(args.url, stream = True)
    image = np.asarray(Image.open(BytesIO(response.content)).convert("RGB"))

    out = Pyx(
        factor=scale, 
        palette=args.palette,
        upscale = scale,
        depth=2,
        # dither="none", 
        # alpha=.6, 
        # boost=True
    ).fit_transform(image)

    out = cv2.resize(out, (image.shape[1],image.shape[0]), interpolation=cv2.INTER_NEAREST)
    out = np.concatenate([image, out], axis=1)

    cv2.imwrite(output_path, cv2.cvtColor(out, cv2.COLOR_BGR2RGB))