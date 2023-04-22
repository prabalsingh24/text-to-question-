from django.views import View
from django.http import JsonResponse

from ..util.text_to_speech_model import TextToQuestionModel
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json

@method_decorator(csrf_exempt, name='dispatch')
class TextToQuestionView(View):
    def post(self, request):
        input_text = request.POST.get('text')
        model = TextToQuestionModel()
        entities = model.get_entities(input_text)
        questions_generated = model.generate_question(input_text, entities)
        response = {
            "input_text": input_text,
            "questions_generated": questions_generated
        }
        return JsonResponse(response, status=200)

    def get(self, request):
        input_text = request.GET.get('text')
        model = TextToQuestionModel()
        entities = model.get_entities(input_text)
        questions_generated = model.generate_question(input_text, entities)
        response = {
            "input_text": input_text,
            "questions_generated": questions_generated
        }
        return JsonResponse(response, status=200)
