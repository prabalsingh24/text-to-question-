import torch
import transformers
from transformers import AutoModelForSeq2SeqLM, DataCollatorForSeq2Seq, Seq2SeqTrainingArguments, Seq2SeqTrainer
from transformers import AutoTokenizer
import spacy
from django.conf import settings


class TextToQuestionModel:
    __instance = None
    def __init__(self):
        TextToQuestionModel.__instance = self
        self.ckpt_path = settings.TEXT_TO_SPEECH_MODEL_DIR
        self.model = AutoModelForSeq2SeqLM.from_pretrained(self.ckpt_path)

        self.model_checkpoint = "t5-base"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_checkpoint)

    @staticmethod
    def getInstance():
        if TextToQuestionModel.__instance == None:
            return TextToQuestionModel()
        return TextToQuestionModel.__instance

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

    def generate_question(self, context, answers):
        questions = []
        questions_and_answers = []
        for answer in answers:
            try:
                question = self.run_model(f"generate question: {answer} context: {context}", self.model, self.tokenizer,
                                          'cpu', max_length=50)[0]
                questions.append(question)
                questions_and_answers.append({'question': question, 'answer': answer.text})
            except Exception as e:
                print(e)

        print("question answers generated")
        print(questions_and_answers)
        return questions_and_answers

    def get_questions_answers_from_text(self, input_text):
        entities = self.model.get_entities(input_text)
        return self.model.generate_question(input_text, entities)
