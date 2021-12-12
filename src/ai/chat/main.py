import argparse
import torch
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--message', type=str, default='')
    args = parser.parse_args()
    device = "cuda:0" if torch.cuda.is_available() else "cpu"

    #download and setup the model and tokenizer
    model_name = 'facebook/blenderbot-400M-distill'
    tokenizer = BlenderbotTokenizer.from_pretrained(model_name)
    model = BlenderbotForConditionalGeneration.from_pretrained(model_name).to(device)

    inputs = tokenizer(args.message, return_tensors="pt").to(device)
    result = model.generate(**inputs)
    print(tokenizer.decode(result[0]).replace('<s>','').replace('</s>','').strip())