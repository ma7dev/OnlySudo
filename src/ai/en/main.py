import argparse
from transformers import pipeline

if __name__ == '__main__':
    
    parser = argparse.ArgumentParser()
    parser.add_argument('--message', type=str, default='')
    args = parser.parse_args()

    prompt = args.message

    generator = pipeline('text-generation', model='EleutherAI/gpt-neo-1.3B', device=0)

    min_length = 60

    print(' '.join(generator(prompt, do_sample=True, min_length=min_length, max_length=min_length*2)[0]['generated_text'].split()))