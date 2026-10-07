# Glass Translator

A translator web app with a glassmorphic design and animated blob shapes. It comes in two versions: a Django app, and a standalone `index.html` that runs in any browser with no setup.

Translations are powered by the free [MyMemory API](https://mymemory.translated.net/doc/spec.php) (500 characters per request, internet required).

## Features

- Translate between **18 languages**, with automatic source-language detection
- Swap languages in one click
- **Copy** the result or **listen** to it using the browser's text-to-speech
- Live character counter (500 max) and **Ctrl + Enter** shortcut
- Glassmorphism UI: frosted-glass cards, blur effects, and morphing, drifting gradient blobs
- Responsive layout that works on phones and desktops
- Clear error messages for empty input, unsupported languages, and network or API failures

## Project Structure

```
glass-translator/
├── index.html                 # Standalone version (no Django needed)
├── manage.py                  # Django command-line entry point
├── requirements.txt           # Python dependency (Django)
├── translator_project/        # Django project configuration
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── translator/                # Django app
│   ├── urls.py                # Routes: / and /api/translate/
│   └── views.py               # Page view + translation API
├── templates/
│   └── index.html             # Django template for the page
└── static/
    ├── css/style.css          # Glass effect and blob animations
    └── js/app.js              # Translate, swap, copy, listen
```

## Django Features and Uses

| Feature | Where | Use |
|---|---|---|
| URL routing (`path`, `include`) | `translator_project/urls.py`, `translator/urls.py` | Maps the home page and the `/api/translate/` endpoint |
| Views | `translator/views.py` | `index` renders the page; `translate` validates input and calls the translation API |
| `JsonResponse` | `translator/views.py` | Returns translations and errors to the browser as JSON |
| Template engine | `templates/index.html` | `{% for %}` builds the language dropdowns from Python data |
| Static files | `settings.py`, `{% static %}` | Serves the CSS and JavaScript |
| Settings and environment variables | `translator_project/settings.py` | Configures debug mode and the secret key |
| Middleware | `settings.py` | Security and common request handling |
| Development server | `manage.py` | `python manage.py runserver` for local testing |
| WSGI | `translator_project/wsgi.py` | Entry point for production servers |

No database is used, so there are no models or migrations.

## Languages Used

- **Python** - Django backend and the translation endpoint
- **HTML** - page structure, including Django template syntax
- **CSS** - glassmorphism, blobs, animations, responsive layout
- **JavaScript** - fetch requests, swap, copy, text-to-speech

## Run It

**Standalone (easiest):** open `index.html` directly in your browser.

**Django version:**

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

Then open http://127.0.0.1:8000/

## Deploying

Set `DJANGO_DEBUG=0` and a real `DJANGO_SECRET_KEY` environment variable, and add your domain to `ALLOWED_HOSTS` in `translator_project/settings.py`. The standalone `index.html` can be hosted free on GitHub Pages (Settings → Pages → deploy from `main`).
