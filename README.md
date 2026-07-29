# FixPix — AI Image Restoration

FixPix is a web application that restores, colorizes, and enhances old or damaged photos using AI and traditional image-processing tools. It provides a React + Vite frontend and a Django + Django REST backend with optional AI models (GFPGAN/LaMa/torch) for higher-quality restoration.

## Stack
- Language(s): JavaScript/TypeScript (frontend), Python (backend)
- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Backend: Django + Django REST Framework
- Notable libraries: OpenCV, Pillow, NumPy, torch, GFPGAN/LaMa (optional)
- Storage: local filesystem by default; optional Cloudinary / S3 integrations

## Key features
- Colorize black & white photos
- Remove scratches / inpaint damaged areas (basic + optional model-based)
- Upscale images
- Before/After interactive comparison
- User authentication (JWT)
- Project dashboard for image management
- Optional asynchronous processing (Celery + Redis)
- Support for cloud storage providers (Cloudinary/S3)

## Repository layout
Top-level:
- fixpix-backend-main/   — Django backend and management scripts
- fixpix-fronted-main/   — React frontend (Vite + Tailwind)
- .vscode/               — editor config (optional)

Annotated tree (top-level, representative):
```
fixpix-backend-main/
  manage.py                 Django entrypoint
  requirements.txt          Python dependencies (opencv, torch, gfpgan, etc.)
  .env.example              example environment variables
  backend/                  Django project (settings.py, urls.py, wsgi/asgi, celery)
  subscriptions/            subscription/payment related code
  scripts/*.py              utility scripts (seed_plans.py, repair_subscriptions.py, create_superuser.py)
  Dockerfile                Backend container (optional)
  vercel.json               Backend config for Vercel (if used)

fixpix-fronted-main/
  package.json              frontend scripts & dependencies
  src/                      React source (UI components, pages)
  public/                   static assets
  index.html                app shell
  tailwind.config.js        Tailwind configuration
  vite.config.js            Vite configuration
  run_project.sh/.bat       convenience scripts to run both services
  docker-compose.yml        local composition (optional)
```

How it fits together:
- The React frontend served by Vite calls the Django REST API (served by the backend) for authentication, project and image management, and to request processing tasks.
- Image processing can be done synchronously on the backend (OpenCV/Pillow) or dispatched to background workers (Celery) that run model-based restorations if the heavy AI stack is available.
- Media files are stored locally by default; storage provider is configurable via environment variables (.env) to use Cloudinary or S3.

## Quickstart — local (shortest path)

Prerequisites:
- Node 16+/npm (for frontend)
- Python 3.10+ (for backend)
- Optional: Redis (for Celery), PostgreSQL (if not using SQLite), GPU + CUDA (for model acceleration)

1. Clone
```bash
git clone git@github.com:yogiandariya/fixpix.git
cd fixpix
```

2. Backend (Django)
```bash
cd fixpix-backend-main

# Create virtualenv and activate
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows (PowerShell)
# .\.venv\Scripts\Activate.ps1

pip install -r requirements.txt

# Copy example env and edit values (SECRET_KEY, storage provider, API keys)
cp .env.example .env
# Edit .env to configure DB, storage, and external API keys

# Apply migrations and create superuser
python manage.py migrate
python manage.py createsuperuser

# Start development server
python manage.py runserver 0.0.0.0:8000
```

3. Frontend (Vite + React)
```bash
cd ../fixpix-fronted-main
npm install
npm run dev
# By default Vite serves at http://localhost:5173
```

There are convenience scripts in the frontend folder (run_project.sh / run_project.bat) that open both services for local development.

## Environment variables (high level)
See fixpix-backend-main/.env.example for a full list. Important items to configure:
- SECRET_KEY — Django secret key
- DEBUG — True/False
- DATABASE_URL — (optional) PostgreSQL DSN; SQLite used by default
- STORAGE_PROVIDER — local | s3 | cloudinary
- CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET (if using Cloudinary)
- AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_STORAGE_BUCKET_NAME (if using S3)
- CELERY_BROKER_URL / CELERY_RESULT_BACKEND (if using Celery)
- NEWS_API_KEY, OPENAI_API_KEY, and other external API keys used by optional features

## Optional / Production notes
- Use PostgreSQL in production and set DATABASE_URL.
- Configure a proper storage provider (S3 or Cloudinary) for scalable media.
- For heavy AI model-based restoration (GFPGAN/LaMa), ensure torch + CUDA are installed on the worker machines and consider separating workers from the web process.
- Use Gunicorn + WhiteNoise (requirements includes gunicorn & whitenoise) or a dedicated static server / CDN for static assets.
- Configure allowed hosts (ALLOWED_HOSTS) and set DEBUG=False in production.

## Docker / Compose
- The backend contains a Dockerfile; there is a docker-compose.yml in the frontend directory for local composition. You can containerize services and connect them via a compose network; you will still need to provide env variables for storage and DB.

## Testing
- No dedicated test runner detected at root; run Django tests in the backend if present:
```bash
cd fixpix-backend-main
python manage.py test
```

## Development tips
- Frontend: Vite + React hot-reload, Tailwind classes in src/
- Backend: backend/settings.py centralizes configuration and reads from .env
- To enable asynchronous model runs, set up Celery + Redis and configure task workers with the heavy AI dependencies installed.

## Contributing
- Open issues / PRs on this repository.
- Describe the change, reference related issues, and include tests where applicable.
- Keep backend and frontend changes isolated to their respective directories.

## License
MIT License — see LICENSE (if present) or include an appropriate LICENSE file.

## Contact / Maintainer
- Repository: https://github.com/yogiandariya/fixpix
- For questions, open an issue or submit a pull request.
