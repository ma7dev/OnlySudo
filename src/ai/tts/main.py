import warnings
warnings.filterwarnings("ignore")  # ignore warnings in this notebook
import argparse
import os, sys

import numpy as np
import torch

from tqdm import *

from hparams import HParams as hp
from audio import save_to_wav
from models import Text2Mel, SSRN
from datasets.lj_speech import vocab, idx2char, get_test_data


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--message', type=str, default='')
    parser.add_argument('--filename', type=str, default=None)
    args = parser.parse_args()

    project_path = "/home/alotaima/Projects/side/onlysudo/src/ai/tts"
    args.outdir = '/src/server/public/ai/tts'
    # args.outdir = '/server/public/ai/tts'
    sys.path.append(project_path)
    
    cur_path = os.path.abspath(os.getcwd())
    root_path = '/'.join(os.path.abspath(os.getcwd()).split('/')[:-1])
    output_path = f"{root_path}{args.outdir}/{args.filename}"

    if args.message == '':
        print('Need message!')
        exit()

    print('start')
    if os.path.exists(output_path):
        os.remove(output_path)
    torch.set_grad_enabled(False)
    text2mel = Text2Mel(vocab)
    text2mel.load_state_dict(torch.load(f"{project_path}/ljspeech-text2mel.pth").state_dict())
    text2mel = text2mel.eval()
    ssrn = SSRN()
    ssrn.load_state_dict(torch.load(f"{project_path}/ljspeech-ssrn.pth").state_dict())
    ssrn = ssrn.eval()

    normalized_sentence = "".join([c if c.lower() in vocab else '' for c in args.message])
    print(normalized_sentence)

    sentences = [normalized_sentence]
    max_N = len(normalized_sentence)
    L = torch.from_numpy(get_test_data(sentences, max_N))
    zeros = torch.from_numpy(np.zeros((1, hp.n_mels, 1), np.float32))
    Y = zeros
    A = None

    for t in range(hp.max_T):
        _, Y_t, A = text2mel(L, Y, monotonic_attention=True)
        Y = torch.cat((zeros, Y_t), -1)
        _, attention = torch.max(A[0, :, -1], 0)
        attention = attention.item()
        if L[0, attention] == vocab.index('E'):  # EOS
            break

    _, Z = ssrn(Y)

    Z = Z.cpu().detach().numpy()
    save_to_wav(Z[0, :, :].T, output_path)
    print('Done!')