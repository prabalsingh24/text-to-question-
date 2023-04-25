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
        try:
            request_body = json.loads(request.body)
            input_text = request_body['text']
            model = TextToQuestionModel.getInstance()
            questions_answers_generated = model.get_questions_answers_from_text(input_text)

            response = {
                "input_text": input_text,
                "questions_and_answers": questions_answers_generated
            }
            return JsonResponse(response, status=200)

        except Exception as e:
            print(e)
            return JsonResponse({"error": "error found in backend "}, status=500)
