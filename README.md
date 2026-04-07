# Hermes Cowork

Un dashboard web open-source pour travailler avec des assistants IA - alternative auto-hebergee au "Claude Cowork" d'Anthropic.

![Dashboard](screenshot.png)

## Fonctionnalites

- **Explorateur de fichiers** - Naviguez dans vos dossiers et fichiers
- **Previews integrees** - PDF, images, Office (docx, xlsx, pptx), code
- **Editeur de code** - Modification directe avec coloration syntaxique (Prism.js)
- **Chat IA** - Interface de conversation avec support multi-modeles
- **Vision** - L'IA peut analyser les images que vous lui envoyez
- **Integration Telegram** - Discutez avec votre assistant depuis votre telephone

## Stack technique

- **Backend**: FastAPI (Python)
- **Frontend**: React + Tailwind CSS + Vite
- **Base de donnees**: SQLite
- **Modeles supportes**: NVIDIA NIM, OpenRouter, et tout provider compatible OpenAI API

## Installation

### Prerequis

- Python 3.10+
- Node.js 18+
- Des cles API (NVIDIA NIM gratuit, OpenRouter, ou autre)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt

# Copier le fichier d'exemple et configurer vos cles
cp .env.example .env
# Editer .env avec vos cles API

python main.py
```

Le backend tourne sur `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend tourne sur `http://localhost:3001`

## Configuration

### Variables d'environnement

| Variable | Description |
|----------|-------------|
| `NVIDIA_API_KEY` | Cle API NVIDIA NIM (gratuit) |
| `OPENROUTER_API_KEY` | Cle OpenRouter pour vision |
| `TELEGRAM_BOT_TOKEN` | Token du bot Telegram (optionnel) |

### Modeles testes

- `z-ai/glm5` via NVIDIA NIM (principal - gratuit)
- `google/gemini-2.0-flash-001` via OpenRouter (vision - quasi gratuit)

## Structure du projet

```
hermes-cowork/
├── backend/
│   ├── main.py           # API FastAPI
│   ├── database.py       # Configuration SQLite
│   ├── models.py         # Modeles SQLAlchemy
│   ├── file_manager.py   # Gestion des fichiers
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── components/
│   │       ├── ChatPanel.tsx
│   │       ├── FileExplorer.tsx
│   │       ├── FilePreview.tsx
│   │       └── ...
│   └── package.json
└── README.md
```

## Routes API

- `GET /api/files` - Lister les fichiers
- `GET /api/files/{path}` - Lire un fichier
- `PUT /api/files/{path}` - Modifier un fichier
- `POST /api/chat` - Envoyer un message a l'IA
- `POST /api/vision` - Analyser une image

## Contribuer

Les contributions sont les bienvenues ! Ouvrez une issue ou une PR.

## Licence

MIT

## Remerciements

Inspire par le "Claude Cowork" d'Anthropic et le framework "How to Speak" de Patrick Winston (MIT).
