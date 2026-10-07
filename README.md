# Glass Translator

A small Django translator app with a glassmorphic UI and animated blob shapes.
Frontend is plain HTML, CSS and JavaScript. No database. Translations come from the free MyMemory API (500 characters per request).

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

Open http://127.0.0.1:8000/

You need an internet connection for translations to work.

## Structure

- `translator/views.py` - page view and `/api/translate/` JSON endpoint
- `templates/index.html` - the single page
- `static/css/style.css` - glass effect and blob animations
- `static/js/app.js` - translate, swap, copy, listen

## Before deploying

Set `DJANGO_DEBUG=0` and a real `DJANGO_SECRET_KEY` environment variable, and add your host to `ALLOWED_HOSTS` in `translator_project/settings.py`.
