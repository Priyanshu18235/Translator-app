import json
import urllib.parse
import urllib.request

from django.http import JsonResponse
from django.shortcuts import render

# code -> display name
LANGS = {
    "en": "English",
    "hi": "Hindi",
    "bn": "Bengali",
    "ta": "Tamil",
    "te": "Telugu",
    "ur": "Urdu",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese",
    "nl": "Dutch",
    "ru": "Russian",
    "tr": "Turkish",
    "ar": "Arabic",
    "ja": "Japanese",
    "ko": "Korean",
    "zh-CN": "Chinese (Simplified)",
}

MAX_CHARS = 500  # MyMemory free-tier limit per request
API_URL = "https://api.mymemory.translated.net/get"


def index(request):
    return render(request, "index.html", {"langs": LANGS.items(), "max_chars": MAX_CHARS})


def translate(request):
    text = request.GET.get("q", "").strip()
    src = request.GET.get("src", "auto")
    dst = request.GET.get("dst", "hi")

    if not text:
        return JsonResponse({"error": "Please enter some text to translate."}, status=400)
    if len(text) > MAX_CHARS:
        return JsonResponse({"error": f"Text is too long (max {MAX_CHARS} characters)."}, status=400)
    if dst not in LANGS or (src != "auto" and src not in LANGS):
        return JsonResponse({"error": "Unsupported language."}, status=400)
    if src == dst:
        return JsonResponse({"translation": text})

    pair = f"{'Autodetect' if src == 'auto' else src}|{dst}"
    url = API_URL + "?" + urllib.parse.urlencode({"q": text, "langpair": pair})
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "glass-translator/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.load(resp)
    except Exception:
        return JsonResponse(
            {"error": "Could not reach the translation service. Check your internet connection."},
            status=502,
        )

    translated = (data.get("responseData") or {}).get("translatedText")
    if str(data.get("responseStatus")) != "200" or not translated:
        return JsonResponse({"error": data.get("responseDetails") or "Translation failed."}, status=502)

    return JsonResponse({"translation": translated})
