import argparse
from transformers import AutoTokenizer, AutoModelWithLMHead

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--message', type=str, default='')
    args = parser.parse_args()

    prompt = args.message


    # model_name = "akhooli/gpt2-small-arabic-poetry"
    model_name = "elgeish/gpt2-medium-arabic-poetry"

    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelWithLMHead.from_pretrained(model_name).to('cuda')
    input_ids = tokenizer.encode(prompt, return_tensors='pt').to('cuda') 

    min_length = 40

    sample_outputs = model.generate(
        input_ids,
        do_sample=True,
        early_stopping=True,
        min_length=min_length,
        max_length=min_length*2,
        num_return_sequences=3,
        pad_token_id=50256,
        repetition_penalty=1.5,
        top_k=32,
        top_p=0.95,
    )

    print(tokenizer.decode(sample_outputs[0]))