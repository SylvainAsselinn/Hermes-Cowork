# Hermes Cowork

Un dashboard web open-source pour travailler avec des assistants IA - alternative auto-hebergee au "Claude Cowork" d'Anthropic.


## 🚀 117 Compétences Hermes

Hermes Agent dispose de **117 compétences** préêtes à l'emploi, organisées par catégories :

### 🤖 Agents autonomes
| Skill | Description |
|-------|-------------|
| `claude-code` | Déléguer des tâches de code à Claude Code |
| `codex` | Déléguer des tâches à OpenAI Codex CLI |
| `hermes-agent` | Guide complet pour Hermes Agent |
| `hermes-subagent-setup` | Créer des sous-agents isolés |
| `opencode` | Déléguer à OpenCode CLI |

### 💼 Business & Productivité
| Skill | Description |
|-------|-------------|
| `eclipse-dropshipping` | Système dropshipping Amazon→eBay |
| `data-analyst` | Requêtes SQL, analyse de données, graphiques |
| `project-planner` | Triiage d'idées et gestion de projets |
| `notion` | Intégration Notion API |
| `linear` | Gestion de projets via Linear API |

### 💻 Développement & DevOps
| Skill | Description |
|-------|-------------|
| `brainstorm-before-code` | Planification avant codage |
| `systematic-debugging` | Débogage systématique 4 phases |
| `test-driven-development` | Cycle RED-GREEN-REFACTOR |
| `github-auth` | Authentification GitHub |
| `github-issues` | Gestion des issues GitHub |
| `github-pr-workflow` | Workflow pull requests complet |
| `github-repo-management` | Gestion de repositories |
| `docker-manager` | Gestion de conteneurs Docker |
| `sandbox-python-venv` | Installation Python dans le sandbox |
| `webhook-subscriptions` | Webhooks pour activation événementielle |

### 🧠 MLOps & Data Science
| Skill | Description |
|-------|-------------|
| `axolotl` | Fine-tuning LLM avec Axolotl |
| `unsloth` | Fine-tuning rapide 2-5x plus vite |
| `peft-fine-tuning` | Fine-tuning efficace (LoRA/QLoRA) |
| `serving-llms-vllm` | Serveur LLM haute performance |
| `llama-cpp` | Inférence CPU/Apple Silicon |
| `gguf-quantization` | Quantization GGUF pour CPU/GPU |
| `whisper` | Reconnaissance vocale multilingue |
| `stable-diffusion-image-generation` | Génération d'images |
| `huggingface-hub` | CLI Hugging Face Hub |
| `modal-serverless-gpu` | GPU serverless pour ML |
| `weights-and-biases` | Tracking d'expériences ML |

### 🔍 Recherche & Web
| Skill | Description |
|-------|-------------|
| `web-researcher` | Recherche approfondie et fact-checking |
| `arxiv` | Recherche de papiers académiques |
| `scrapling` | Web scraping avec bypass Cloudflare |
| `blogwatcher` | Monitoring de blogs RSS/Atom |
| `polymarket` | Données de marchés de prédiction |
| `youtube-content` | Transcripts YouTube structurés |

### 🎨 Contenu créatif
| Skill | Description |
|-------|-------------|
| `ascii-art` | Art ASCII avec pyfiglet (571 fonts) |
| `excalidraw` | Diagrammes style dessin à la main |
| `manim-video` | Animations mathématiques 3Blue1Brown |
| `p5js` | Art génératif et visualisations interactives |
| `songwriting-and-ai-music` | Création musicale avec IA |
| `gif-search` | Recherche de GIFs via Tenor |

### 📧 Email & Communication
| Skill | Description |
|-------|-------------|
| `himalaya` | Gestion email via IMAP/SMTP |
| `email-monitor` | Surveillance Gmail automatique |
| `google-workspace` | Gmail, Calendar, Drive, Docs |
| `slack-bot` | Messages et monitoring Slack |

### 🔐 Sécurité & Red Teaming
| Skill | Description |
|-------|-------------|
| `security-auditor` | Audit de sécurité code |
| `godmode` | Jailbreak de LLMs (red teaming) |
| `agent-hardening` | Tests d'injection sur agents |

### 🔌 MCP & Intégrations
| Skill | Description |
|-------|-------------|
| `native-mcp` | Client MCP intégré |
| `mcporter` | CLI pour serveurs MCP |

### 🏠 Smart Home & Loisirs
| Skill | Description |
|-------|-------------|
| `openhue` | Contrôle Philips Hue |
| `find-nearby` | Recherche de lieux (restaurants, etc.) |
| `minecraft-modpack-server` | Serveur Minecraft moddé |

### 📄 Productivité documents
| Skill | Description |
|-------|-------------|
| `pdf-reader-summarizer` | Lecture et résumé de PDFs |
| `powerpoint` | Création/édition de présentations PPTX |
| `nano-pdf` | Édition de PDFs en langage naturel |
| `ocr-and-documents` | Extraction texte de documents |
| `context-persistence` | Sauvegarde de contexte |

### ⚙️ Système & Monitoring
| Skill | Description |
|-------|-------------|
| `system-monitor` | Surveillance ressources système |
| `task-queue-manager` | File d'attente de messages |
| `downloads-sorter` | Tri automatique du dossier Downloads |
| `windows-desktop-capture` | Capture écran Windows |
| `wsl-sandbox-operations` | Opérations dans le sandbox WSL |

### 🚀 Déploiement
| Skill | Description |
|-------|-------------|
| `static-site-deployer` | Déploiement sites statiques gratuits |
| `pan-ui-dashboard` | Dashboard web pour Hermes Agent |
| `hermes-workspace` | Interface web native Hermes |

### 🛠️ API & Outils
| Skill | Description |
|-------|-------------|
| `api-builder` | Création d'APIs REST/GraphQL |
| `diagram-maker` | Génération de diagrammes Mermaid |
| `skill-factory` | Création et publication de skills |
| `hermeshub-skill-installer` | Installation depuis HermesHub |
| `create-hermes-subagent` | Création de sous-agents |

---

## Fonctionnalités

- **Explorateur de fichiers** - Naviguez dans vos dossiers et fichiers
- **Previews intégrées** - PDF, images, Office (docx, xlsx, pptx), code
- **Éditeur de code** - Modification directe avec coloration syntaxique (Prism.js)
- **Chat IA** - Interface de conversation avec support multi-modèles
- **Vision** - L'IA peut analyser les images que vous lui envoyez
- **Intégration Telegram** - Discutez avec votre assistant depuis votre téléphone

## Stack technique

- **Backend**: FastAPI (Python)
- **Frontend**: React + Tailwind CSS + Vite
- **Base de données**: SQLite
- **Modèles supportés**: NVIDIA NIM, OpenRouter, et tout provider compatible OpenAI API

## Installation

### Prérequis

- Python 3.10+
- Node.js 18+
- Des clés API (NVIDIA NIM gratuit, OpenRouter, ou autre)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate # Linux/Mac
pip install -r requirements.txt

# Copier le fichier d'exemple et configurer vos clés
cp .env.example .env
# Éditer .env avec vos clés API

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
| `NVIDIA_API_KEY` | Clé API NVIDIA NIM (gratuit) |
| `OPENROUTER_API_KEY` | Clé OpenRouter pour vision |
| `TELEGRAM_BOT_TOKEN` | Token du bot Telegram (optionnel) |

### Modèles testés

- `z-ai/glm5` via NVIDIA NIM (principal - gratuit)
- `google/gemini-2.0-flash-001` via OpenRouter (vision - quasi gratuit)

## Structure du projet

```
hermes-cowork/
├── backend/
│   ├── main.py           # API FastAPI
│   ├── database.py       # Configuration SQLite
│   ├── models.py         # Modèles SQLAlchemy
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
- `POST /api/chat` - Envoyer un message à l'IA
- `POST /api/vision` - Analyser une image

## Contribuer

Les contributions sont les bienvenues ! Ouvrez une issue ou une PR.

## Licence

MIT

## Remerciements

Inspiré par le "Claude Cowork" d'Anthropic et le framework "How to Speak" de Patrick Winston (MIT).
