# Gemini Image Gen Plugin for Claude Code

Generate stunning AI images using Google's **Gemini** image generation models with professional prompt optimization based on analysis of 1,186 viral prompts.

![Example Images](https://via.placeholder.com/800x200/1a1a2e/eaeaea?text=Cyberpunk+Samurai+%7C+Astronaut+on+Mars+%7C+Fantasy+Dragon)

## Features

- 🎨 **Smart Prompt Optimization** - 6 rules extracted from viral prompts
- 🎯 **Genre Detection** - Auto-detects food, portrait, product, cinematic, 3D, design
- 🚀 **Lightweight Agent** - Keeps main context clean (~500 tokens vs 50K)
- 🔑 **Flexible Setup** - Works with direct API key OR proxy
- 📚 **Template Library** - Pre-built patterns from top-performing prompts

## Quick Start

### Option 1: Direct API Key (Recommended)

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY = "your_api_key_here"
```

**Windows (Git Bash / CMD):**
```bash
export GEMINI_API_KEY=your_api_key_here
# Or for CMD:
set GEMINI_API_KEY=your_api_key_here
```

**macOS / Linux:**
```bash
export GEMINI_API_KEY=your_api_key_here
```

Then install the plugin (see Installation section below).

### Option 2: With Proxy

```bash
# Start the antigravity-claude-proxy
cd antigravity-claude-proxy && npm start

# Install the plugin (see Installation section below)
# Use it in Claude Code: /image a bowl of ramen
```

## Installation

### From GitHub

**Windows (PowerShell):**
```powershell
git clone https://github.com/AryanXPatel/gemini-image-gen.git
Copy-Item -Recurse gemini-image-gen "$env:USERPROFILE\.claude\plugins\gemini-image-gen"
```

**Windows (Git Bash / MINGW64):**
```bash
git clone https://github.com/AryanXPatel/gemini-image-gen.git
cp -r gemini-image-gen ~/. claude/plugins/
# Or if you're inside the repo:
cd .. && cp -r gemini-image-gen ~/.claude/plugins/
```

**macOS / Linux:**
```bash
git clone https://github.com/AryanXPatel/gemini-image-gen.git
cp -r gemini-image-gen ~/.claude/plugins/
```

**Already inside the repo?**
```bash
# Go up one directory first
cd ..
cp -r gemini-image-gen ~/.claude/plugins/

# Or copy current directory
cp -r . ~/.claude/plugins/gemini-image-gen
```

### From Claude Code Marketplace

```
/plugin install gemini-image-gen
```

## Usage

### Basic Generation

```
/image a bowl of ramen
```

The plugin will:
1. Spawn a lightweight agent
2. Detect genre (food)
3. Apply optimization rules
4. Generate and save the image
5. Return just the result

### With Refinement

```
/image a sunset over mountains
# "Make it more dramatic"
/image --refine add volumetric god rays and deeper colors
```

### Raw Mode (No Optimization)

```
/image --raw "your exact prompt here without any changes"
```

### Template Mode

```
/image --template food "steaming ramen bowl"
/image --template portrait "woman in rain"
/image --template cinematic "car chase scene"
```

## The 6 Optimization Rules

Based on analysis of 1,186 viral AI-generated images:

| Rule | Description | Example |
|------|-------------|---------|
| **1. Professional Terms** | Replace feeling words with specific terminology | "cinematic" → "Wong Kar-wai aesthetics, Kodak Vision3 500T" |
| **2. Quantified Parameters** | Use exact technical specs | "professional" → "90mm lens, f/1.8, shallow DOF" |
| **3. Negative Constraints** | State what NOT to include | "No text, no watermarks, no distortion" |
| **4. Sensory Stacking** | Add tactile, motion, temperature | "steam rising, texture tangible, crisp cold" |
| **5. Group & Cluster** | Organize complex prompts | Visual Style / Lighting / Technical / Constraints |
| **6. Genre Adaptation** | Apply genre-specific patterns | Food: 45° overhead, warm tones, macro |

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Your Google AI Studio API key | (none - uses proxy) |
| `GEMINI_MODEL` | Model to use | `gemini-3-pro-image` |
| `PROXY_HOST` | Proxy hostname | `localhost` |
| `PROXY_PORT` | Proxy port | `8080` |

### Getting a Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new API key
4. Set it: `export GEMINI_API_KEY=your_key_here`

### Using the Proxy (Alternative)

If you prefer using the proxy for multi-account support:

1. Clone [antigravity-claude-proxy](https://github.com/anthropics/antigravity-claude-proxy)
2. Configure your Google accounts
3. Run: `npm start`
4. The plugin will auto-detect and use the proxy

## Plugin Structure

```
gemini-image-gen/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── agents/
│   └── image-gen.md          # Lightweight generation agent
├── commands/
│   └── image.md              # /image command
├── skills/
│   └── prompt-mastery/
│       ├── SKILL.md          # Full optimization skill
│       └── references/       # Terminology, templates, examples
├── scripts/
│   └── gen.js                # Image generation script
└── data/
    ├── prompts-by-category.json  # 90 categorized viral prompts
    ├── templates.json            # 8 genre templates
    └── top-prompts.json          # Top 30 overall
```

## Supported Genres

| Genre | Best For | Key Techniques |
|-------|----------|----------------|
| **food** | Dishes, recipes, ingredients | 45° overhead, macro, steam, warm tones |
| **portrait** | People, faces, fashion | 90mm f/1.8, skin texture, rim lighting |
| **product** | Commercial, advertising | Studio lighting, floating, clean background |
| **cinematic** | Movie stills, dramatic scenes | Volumetric light, chiaroscuro, wide lens |
| **3d** | Icons, renders, characters | Soft 3D, white background, grid layout |
| **design** | UI, posters, typography | Minimalist, grid system, limited palette |
| **japanese** | Wabi-sabi, minimal, airy | High-key, diffused light, negative space |

## Examples

### Input → Output

**Simple:** "a bowl of ramen"

**Optimized:**
```
Steaming bowl of authentic Japanese tonkotsu ramen, rich milky broth.

Visual Style:
High-end culinary magazine aesthetic. Warm earth tones. Hasselblad quality.

Composition:
45-degree overhead, 85mm lens, f/2.8, shallow DOF on soft-boiled egg.

Sensory Details:
Steam wisps rising, noodles glisten, chashu with caramelized edges,
aroma seems to penetrate the frame.

Constraints:
No utensils. No text. Maintain appetizing warm color temperature.
```

## Credits

- **Prompt Optimization Rules**: Derived from [nanobanana-trending-prompts](https://github.com/jau123/nanobanana-trending-prompts) (1,186 viral prompts analysis)
- **Proxy Support**: [antigravity-claude-proxy](https://github.com/anthropics/antigravity-claude-proxy)

## License

MIT License - see [LICENSE](LICENSE)

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

---

Made with ❤️ for the Claude Code community
