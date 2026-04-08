# Hermes Cowork

Un dashboard web open-source pour travailler avec des assistants IA - alternative auto-hebergee au "Claude Cowork" d'Anthropic.

![Dashboard](screenshot.png)

## Fonctionnalites

- **Explorateur de fichiers** - Naviguez dans vos dossiers et fichiers
- **Previews integrees** - PDF, images, Office (docx, xlsx, pptx), code
- **Editeur de code** - Modification directe avec coloration syntaxique (Prism.js)
- **Chat IA** - Interface de conversation avec support multi-modeles
- **Vision** - L\'IA peut analyser les images que vous lui envoyez
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
source venv/bin/activate # Linux/Mac
pip install -r requirements.txt

# Copier le fichier d\'exemple et configurer vos cles
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

### Variables d\'environnement

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
- `POST /api/chat` - Envoyer un message a l\'IA
- `POST /api/vision` - Analyser une image

## Competences Hermes (117 skills)

Hermes Agent dispose de 117 competences prete a l\'emploi, organisbe par categories :

### Agents autonomes
- `claude-code` - Deleguer des taches de code a Claude Code
- `codex` - Deleguer des taches a OpenAI Codex CLI
- `hermes-agent` - Guide complet pour Hermes Agent
- `hermes-subagent-setup` - Creer des sous-agents isoles
- `opencode` - Deleguer a OpenCode CLI

### Business & Productivite
- `eclipse-dropshipping` - Systeme dropshipping Amazon vers eBay
- `data-analyst` - Requetes SQL, analyse de donnees, graphiques
- `project-planner` - Triage d\'idees et gestion de projets
- `notion` - Integration Notion API
- `linear` - Gestion de projets via Linear API

### Developpement & DevOps
- `brainstorm-before-code` - Planification avant codage
- `systematic-debugging` - Debuggage systematique 4 phases
- `test-driven-development` - Cycle RED-GREEN-REFACTOR
- `github-auth` - Authentification GitHub
- `github-issues` - Gestion des issues GitHub
- `github-pr-workflow` - Workflow pull requests complet
- `github-repo-management` - Gestion de repositories
- `docker-manager` - Gestion de conteneurs Docker
- `sandbox-python-venv` - Installation Python dans le sandbox
- `webhook-subscriptions` - Webhooks pour activation evenementielle

### MLOps & Data Science
- `axolotl` - Fine-tuning LLM avec Axolotl
- `unsloth` - Fine-tuning rapide 2-5x plus vite
- `peft-fine-tuning` - Fine-tuning efficace (LoRA/QLoRA)
- `serving-llms-vllm` - Serveur LLM haute performance
- `llama-cpp` - Inference CPU/Apple Silicon
- `gguf-quantization` - Quantization GGUF pour CPU/GPU
- `whisper` - Reconnaissance vocale multilingue
- `stable-diffusion-image-generation` - Generation d\'images
- `huggingface-hub` - CLI Hugging Face Hub
- `modal-serverless-gpu` - GPU serverless pour ML
- `weights-and-biases` - Tracking d\'experiences ML

### Recherche & Web
- `web-researcher` - Recherche approfondie et fact-checking
- `arxiv` - Recherche de papiers academiques
- `scrapling` - Web scraping avec bypass Cloudflare
- `blogwatcher` - Monitoring de blogs RSS/Atom
- `polymarket` - Donnees de marches de prediction
- `youtube-content` - Transcripts YouTube structures

### Contenu creatif
- `ascii-art` - Art ASCII avec pyfiglet (571 fonts)
- `excalidraw` - Diagrammes style dessin a la main
- `manim-video` - Animations mathematiques 3Blue1Brown
- `p5js` - Art generatif et visualisations interactives
- `songwriting-and-ai-music` - Creation musicale avec IA
- `gif-search` - Recherche de GIFs via Tenor

### Email & Communication
- `himalaya` - Gestion email via IMAP/SMTP
- `email-monitor` - Surveillance Gmail automatique
- `google-workspace` - Gmail, Calendar, Drive, Docs
- `slack-bot` - Messages et monitoring Slack

### Securite & Red Teaming
- `security-auditor` - Audit de securite code
- `godmode` - Jailbreak de LLMs (red teaming)
- `agent-hardening` - Tests d\'injection sur agents

### MCP & Integrations
- `native-mcp` - Client MCP integre
- `mcporter` - CLI pour serveurs MCP

### Smart Home & Loisirs
- `openhue` - Controle Philips Hue
- `find-nearby` - Recherche de lieux (restaurants, etc.)
- `minecraft-modpack-server` - Serveur Minecraft modde

### Productivite documents
- `pdf-reader-summarizer` - Lecture et resume de PDFs
- `powerpoint` - Creation/edition de presentations PPTX
- `nano-pdf` - Edition de PDFs en langage naturel
- `ocr-and-documents` - Extraction texte de documents
- `context-persistence` - Sauvegarde de contexte

### Systeme & Monitoring
- `system-monitor` - Surveillance ressources systeme
- `task-queue-manager` - File d\'attente de messages
- `downloads-sorter` - Tri automatique du dossier Downloads
- `windows-desktop-capture` - Capture ecran Windows
- `wsl-sandbox-operations` - Operations dans le sandbox WSL

### Deploiement
- `static-site-deployer` - Deploiement sites statiques gratuits
- `pan-ui-dashboard` - Dashboard web pour Hermes Agent
- `hermes-workspace` - Interface web native Hermes

### API & Outils
- `api-builder` - Creation d\'APIs REST/GraphQL
- `diagram-maker` - Generation de diagrammes Mermaid
- `skill-factory` - Creation et publication de skills
- `hermeshub-skill-installer` - Installation depuis HermesHub
- `create-hermes-subagent` - Creation de sous-agents

## Contribuer

Les contributions sont les bienvenues ! Ouvrez une issue ou une PR.

## Licence

MIT

## Remerciements

Inspire par le "Claude Cowork" d'Anthropic et le framework "How to Speak" de Patrick Winston (MIT).
