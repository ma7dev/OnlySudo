import warnings
warnings.filterwarnings("ignore")  # ignore warnings in this notebook
import argparse
import os, sys

from klaam import TextToSpeech


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--message', type=str, default='')
    parser.add_argument('--filename', type=str, default="test.wav")
    args = parser.parse_args()

    project_path = "/home/alotaima/Projects/side/onlysudo/src/ai/klaam"
    # args.outdir = '/src/server/public/ai/tts'
    args.outdir = '/server/public/ai/tts'
    print(project_path)
    os.chdir(project_path)

    cur_path = os.path.abspath(os.getcwd())
    root_path = '/'.join(os.path.abspath(os.getcwd()).split('/')[:-2])
    output_path = f"{root_path}{args.outdir}/{args.filename}"

    if args.message == '':
        print('Need message!')
        exit()

    print('start')
    model = TextToSpeech()
    if os.path.exists(output_path):
        os.remove(output_path)
    model.synthesize(args.message,output_path=output_path)
    print('Done!')