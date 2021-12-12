import argparse

from transformers import AutoTokenizer, AutoModelWithLMHead

# from transformers import GPT2TokenizerFast, pipeline
# from transformers import GPT2LMHeadModel
# from arabert.aragpt2.grover.modeling_gpt2 import GPT2LMHeadModel
# from arabert.preprocess import ArabertPreprocessor

if __name__ == '__main__':
    
    parser = argparse.ArgumentParser()
    parser.add_argument('--message', type=str, default='')
    args = parser.parse_args()

    prompt = args.message

    model_name = "akhooli/gpt2-small-arabic"

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

    # arabert_prep = ArabertPreprocessor(model_name=model_name)
    # text_clean = arabert_prep.preprocess(prompt)

    # model = GPT2LMHeadModel.from_pretrained(model_name)
    # tokenizer = GPT2TokenizerFast.from_pretrained(model_name)
    # generation_pipeline = pipeline("text-generation",model=model,tokenizer=tokenizer)
    
    # sample_outputs = generation_pipeline(
    #     prompt,
    #     pad_token_id=tokenizer.eos_token_id,
    #     num_beams=10,
    #     max_length=200,
    #     top_p=0.9,
    #     repetition_penalty = 3.0,
    #     no_repeat_ngram_size = 3
    # )

    # print(sample_outputs[0]['generated_text'])