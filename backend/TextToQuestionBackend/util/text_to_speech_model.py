import torch
import transformers
from transformers import AutoModelForSeq2SeqLM, DataCollatorForSeq2Seq, Seq2SeqTrainingArguments, Seq2SeqTrainer
from transformers import AutoTokenizer
import spacy
from django.conf import settings

class TextToQuestionModel:

    def __init__(self):
        self.ckpt_path = settings.TEXT_TO_SPEECH_MODEL_DIR
        self.model = AutoModelForSeq2SeqLM.from_pretrained(self.ckpt_path)

        self.model_checkpoint = "t5-base"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_checkpoint)

    def run_model(self, input_string, model, tokenizer, device, **generator_args):
        input_ids = tokenizer.encode(input_string, return_tensors="pt").to(torch.device(device))
        res = model.generate(
            input_ids, **generator_args)
        output = tokenizer.batch_decode(res, skip_special_tokens=True)
        return output

    def get_entities(self, text):
        seen = set()
        entities = []
        spacy_nlp = spacy.load('en_core_web_sm')
        for entity in spacy_nlp(text).ents:
            if entity.text not in seen:
                seen.add(entity.text)
                entities.append(entity)
        return sorted(entities, key=lambda e: e.text)

    def generate_question(self, context, answer):
        return self.run_model(f"generate question: {answer} context: {context}", self.model, self.tokenizer, 'cpu', max_length=50)
