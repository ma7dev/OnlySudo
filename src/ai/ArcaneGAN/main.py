import argparse
import os
import time
from facenet_pytorch import MTCNN
from torchvision import transforms
import torch, PIL

from tqdm.notebook import tqdm
from glob import glob
from PIL import Image, ImageOps
import requests
from io import BytesIO
import numpy as np
import cv2

# simplest ye olde trustworthy MTCNN for face detection with landmarks
def detect(img, mtcnn):
    # Detect faces
    batch_boxes, batch_probs, batch_points = mtcnn.detect(img, landmarks=True)
    # Select faces
    if not mtcnn.keep_all:
        batch_boxes, batch_probs, batch_points = mtcnn.select_boxes(
            batch_boxes, batch_probs, batch_points, img, method=mtcnn.selection_method
        )
    return batch_boxes, batch_points

# my version of isOdd, should make a separate repo for it :D
def makeEven(_x):
    return _x if (_x % 2 == 0) else _x+1

# the actual scaler function
def scale(boxes, _img, max_res=1_500_000, target_face=256, fixed_ratio=0, max_upscale=2, VERBOSE=False):
    x, y = _img.size
    ratio = 2 #initial ratio
    #scale to desired face size
    if (boxes is not None):
        if len(boxes)>0:
            ratio = target_face/max(boxes[0][2:]-boxes[0][:2]); 
            ratio = min(ratio, max_upscale)
            if VERBOSE: print('up by', ratio)

    if fixed_ratio>0:
        if VERBOSE: print('fixed ratio')
        ratio = fixed_ratio
    x*=ratio
    y*=ratio
    #downscale to fit into max res 
    res = x*y
    if res > max_res:
        ratio = pow(res/max_res,1/2); 
        if VERBOSE: print(ratio)
        x=int(x/ratio)
        y=int(y/ratio)
 
    #make dimensions even, because usually NNs fail on uneven dimensions due skip connection size mismatch
    x = makeEven(int(x))
    y = makeEven(int(y))
    
    size = (x, y)

    return _img.resize(size)

""" 
    A useful scaler algorithm, based on face detection.
    Takes PIL.Image, returns a uniformly scaled PIL.Image
    boxes: a list of detected bboxes
    _img: PIL.Image
    max_res: maximum pixel area to fit into. Use to stay below the VRAM limits of your GPU.
    target_face: desired face size. Upscale or downscale the whole image to fit the detected face into that dimension.
    fixed_ratio: fixed scale. Ignores the face size, but doesn't ignore the max_res limit.
    max_upscale: maximum upscale ratio. Prevents from scaling images with tiny faces to a blurry mess.
"""

def scale_by_face_size(_img, mtcnn, max_res=1_500_000, target_face=256, fix_ratio=0, max_upscale=2, VERBOSE=False):
    boxes = None
    boxes, _ = detect(_img,mtcnn)
    if VERBOSE: print('boxes',boxes)
    img_resized = scale(boxes, _img, max_res, target_face, fix_ratio, max_upscale, VERBOSE)
    return img_resized

def makeEven(_x):
    return int(_x) if (_x % 2 == 0) else int(_x+1)

def tensor2im(var):
    return var.mul(t_stds).add(t_means).mul(255.).clamp(0,255).permute(1,2,0)

def proc_pil_img(input_image, model):
    transformed_image = img_transforms(input_image)[None,...].cuda().half()
            
    with torch.no_grad():
        result_image = model(transformed_image)[0]; print(result_image.shape)
        output_image = tensor2im(result_image)
        output_image = output_image.detach().cpu().numpy().astype('uint8')
        output_image = PIL.Image.fromarray(output_image)
    return output_image


def fit(img,maxsize=512):
    maxdim = max(*img.size)
    if maxdim>maxsize:
        ratio = maxsize/maxdim
        x,y = img.size
        size = (int(x*ratio),int(y*ratio)) 
        img = img.resize(size)
    return img

def process(output_path,mtcnn,model,img):
    img = scale_by_face_size(img, mtcnn, target_face=300, max_res=1_500_000, max_upscale=2)
    res = proc_pil_img(img, model)
    out = np.concatenate([img, res], axis=1)
    cv2.imwrite(output_path, cv2.cvtColor(out, cv2.COLOR_BGR2RGB))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', type=str, default='')
    parser.add_argument('--filename', type=str, default=f"{time.time()}.jpg")
    args = parser.parse_args()

    project_path = "/home/alotaima/Projects/side/onlysudo/src/ai/ArcaneGAN"
    args.outdir = '/src/server/public/ai/arcane'
    args.size = 1024

    if args.url == '':
        print('Need url or streamer name!')
        exit()

    root_path = '/'.join(os.path.abspath(os.getcwd()).split('/')[:-1])
    output_path = f"{root_path}{args.outdir}/{args.filename}"

    print("start")    
    mtcnn = MTCNN(image_size=args.size, margin=80)

    means = [0.485, 0.456, 0.406]
    stds = [0.229, 0.224, 0.225]

    t_stds = torch.tensor(stds).cuda()[:,None,None]
    t_means = torch.tensor(means).cuda()[:,None,None]

    img_transforms = transforms.Compose([                        
                transforms.ToTensor(),
                transforms.Normalize(means,stds)])

    version = '0.3' #@param ['0.1','0.2']
    model_path = f'{project_path}/ArcaneGANv{version}.jit' 

    model = torch.jit.load(model_path).eval().cuda()
    
    response = requests.get(args.url, stream = True)
    img = Image.open(BytesIO(response.content)).convert('RGB') 
    img = ImageOps.fit(img, (args.size, args.size), centering=(0.5, 0.5))

    img = scale_by_face_size(img, mtcnn, target_face=300, max_res=1_500_000, max_upscale=2)
    res = proc_pil_img(img, model)
    out = np.concatenate([img, res], axis=1)
    cv2.imwrite(output_path, cv2.cvtColor(out, cv2.COLOR_BGR2RGB))
    print("Done!")