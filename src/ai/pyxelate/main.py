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
    args = parser.parse_args()

    project_path = "/home/alotaima/Projects/side/onlysudo/src/ai/pyxelate"
    # args.outdir = '/src/api/public/ai/pyxelate'
    args.outdir = '/api/public/ai/pyxelate'

    root_path = '/'.join(os.path.abspath(os.getcwd()).split('/')[:-2])
    output_path = f"{root_path}{args.outdir}/{args.filename}"
    
    if args.url == '':
        print('Need url or streamer name!')
        exit()

    downsample_by = 1  
    palette = 7  

    response = requests.get(args.url, stream = True)
    image = np.asarray(Image.open(BytesIO(response.content)).convert("RGB"))

    out = Pyx(factor=downsample_by, palette=Pal.MICROSOFT_WINDOWS_PAINT, dither="none", alpha=.6, boost=True).fit_transform(image)

    # image = np.resize(image, (new_image.shape[0],new_image.shape[1],3))
    # print(image.shape, new_image.shape)
    # out = np.concatenate([image, new_image], axis=1)
    # print(output_path)
    cv2.imwrite(output_path, cv2.cvtColor(out, cv2.COLOR_BGR2RGB))