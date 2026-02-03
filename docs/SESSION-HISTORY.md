# Session History: Building gemini-image-gen Plugin

**Date:** February 3, 2026
**Session Goal:** Create a Claude Code plugin for AI image generation using Google's Gemini 3 Pro Image model with professional prompt optimization.

---

## Table of Contents

1. [Initial Discovery](#1-initial-discovery)
2. [Research Phase](#2-research-phase)
3. [Architecture Decisions](#3-architecture-decisions)
4. [Plugin Development](#4-plugin-development)
5. [Testing & Validation](#5-testing--validation)
6. [Optimization: Lightweight Agent](#6-optimization-lightweight-agent)
7. [GitHub Release](#7-github-release)
8. [Key Learnings](#8-key-learnings)
9. [Future Improvements](#9-future-improvements)

---

## 1. Initial Discovery

### The Proxy Setup

User has a local proxy running at `http://localhost:8080` using [antigravity-claude-proxy](https://github.com/badrisnarayanan/antigravity-claude-proxy).

**Key finding from `/health` endpoint:**
- Model `gemini-3-pro-image` is available at 100% quota
- This is Google's 2026 image generation model
- Proxy converts Anthropic API format → Google Generative AI format

### First Successful Image Generation

We tested the API with a simple Node.js script:

```javascript
// POST to http://localhost:8080/v1/messages
{
  "model": "gemini-3-pro-image",
  "max_tokens": 8192,
  "messages": [{
    "role": "user",
    "content": "Generate an image: [prompt]"
  }]
}
```

**Response format:**
- Returns `thinking` block with model reasoning
- Returns `image` block with base64 JPEG data
- Images are ~700KB-1.2MB each

### First Test Images Generated

1. `generated-image-1.jpg` - Sunset over mountains (purple/orange) ✅
2. `cyberpunk-samurai.jpg` - Neon armor, rain-soaked streets ✅
3. `astronaut-on-mars.jpg` - Horse riding on Mars with Earth visible ✅
4. `crystal-cave.jpg` - Bioluminescent purple/blue formations ✅

---

## 2. Research Phase

### Source 1: nanobanana-trending-prompts

**Repository:** https://github.com/jau123/nanobanana-trending-prompts

User cloned this repo containing 1,186 viral AI image prompts ranked by engagement (likes/views from X/Twitter).

**Key data structure in `prompts.json`:**
```json
{
  "rank": 1,
  "id": "tweet_id",
  "prompt": "the actual prompt text",
  "likes": 5647,
  "views": 593553,
  "categories": ["JSON", "Photograph", "Girl"],
  "model": "nanobanana",
  "images": ["url1", "url2"]
}
```

**Categories found:**
- JSON (574 prompts) - Structured JSON format prompts
- Photograph (423) - Realistic photography
- Girl (319) - Portrait photography
- Other (245) - Miscellaneous
- 3D (165) - Renders, icons
- App (155) - UI/UX designs
- Product (93) - Commercial photography
- Food (76) - Culinary photography

### Source 2: Reddit Post Analysis

**Post:** r/PromptEngineering - "After analyzing 1,000+ viral prompts, I made a system prompt"

**The 6 Core Rules Extracted:**

| Rule | Description |
|------|-------------|
| 1. Professional Terms | Replace feeling words with specific terminology (Wong Kar-wai, Kodak Vision3 500T) |
| 2. Quantified Parameters | Use exact specs (90mm lens, f/1.8, shallow DOF) |
| 3. Negative Constraints | State what NOT to include (no text, no watermarks) |
| 4. Sensory Stacking | Add tactile, olfactory, motion, temperature descriptions |
| 5. Group & Cluster | Organize with headers (Visual Style, Lighting, Technical, Constraints) |
| 6. Format Adaptation | Simple scenes = paragraphs, Complex = structured groups |

### System Prompt from Research

The repo included `system-prompt-en.md` - a system prompt that auto-optimizes casual prompts into professional ones using the 6 rules.

---

## 3. Architecture Decisions

### Decision 1: Plugin vs Skill vs MCP Server

**Options considered:**
1. **Skill only** - Single markdown file with instructions
2. **Plugin** - Full package with commands, agents, skills
3. **MCP Server** - Native tool integration

**Decision: Plugin**

**Rationale:**
- Need `/image` command for quick access
- Need agent for autonomous generation
- Need skill for deep knowledge
- Need data files for templates/prompts
- Plugin supports all of these

### Decision 2: Smart Genre Detection

**Idea:** Auto-detect genre from user's prompt and apply genre-specific techniques.

**Implementation:**
```
User: "picture of sushi"
    ↓
AI detects: food genre
    ↓
Loads food techniques: 45° overhead, macro, steam, warm tones
    ↓
Applies 6 rules with food-specific patterns
    ↓
Generates optimized prompt → Image
```

**Created `prompts-by-category.json`:**
- 6 categories: food, portrait, product, 3d, cinematic, design
- 15 prompts per category (90 total)
- Each prompt has extracted `techniques` array

### Decision 3: Lightweight Agent Architecture

**Problem discovered:** Full Opus subagents used ~50K tokens each just to read the skill and generate one image. This is expensive and bloats context.

**Solution:** Create a dedicated `image-gen` agent with:
- Optimization rules embedded in agent definition
- Spawned via Task tool with haiku model
- Returns only result (~100 tokens)
- Main context stays clean (~500 tokens)

**Before:**
```
Main context: Load 50K tokens of skill → Generate → 50K used
```

**After:**
```
Main context: Spawn agent → 500 tokens
Agent context: Generate → Returns result → Disposed
Main context: "✅ Generated: file.jpg" → 100 tokens
```

### Decision 4: Dual API Support

**Requirement:** Support both proxy users AND direct API key users.

**Implementation in `gen.js`:**
```javascript
if (process.env.GEMINI_API_KEY) {
  // Direct Google AI API call
  generateWithDirectAPI(prompt);
} else {
  // Proxy mode (Anthropic format)
  generateWithProxy(prompt);
}
```

**Environment variables:**
- `GEMINI_API_KEY` - Direct Google AI Studio key
- `PROXY_HOST` / `PROXY_PORT` - For proxy mode
- `GEMINI_MODEL` - Default: `gemini-3-pro-image`

---

## 4. Plugin Development

### Final Plugin Structure

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
│       ├── SKILL.md          # Full optimization skill (for deep learning)
│       └── references/
│           ├── scene-guide.md     # Scene-specific patterns
│           ├── terminology.md     # Professional terms database
│           └── top-prompts.md     # Viral prompt examples
├── scripts/
│   └── gen.js                # Image generation script
├── data/
│   ├── prompts-by-category.json  # 90 categorized prompts with techniques
│   ├── templates.json            # 8 genre templates
│   └── top-prompts.json          # Top 30 overall
├── docs/
│   └── SESSION-HISTORY.md    # This file
├── .env.example
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

### Key Files Created

**1. `agents/image-gen.md`**
- Lightweight agent with embedded 6 rules
- Genre detection table
- Execution process (detect → optimize → generate → return)
- Concise output format

**2. `commands/image.md`**
- `/image` command definition
- Spawns agent instead of loading full skill
- Supports flags: `--raw`, `--template`, `--refine`

**3. `skills/prompt-mastery/SKILL.md`**
- Full 6 rules with examples
- Smart genre-based optimization flow
- References to terminology, scene guides, top prompts

**4. `scripts/gen.js`**
- Dual mode: Direct API + Proxy
- Auto-generates filename from prompt
- Returns JSON result for programmatic use
- Clear error handling with setup instructions

**5. `data/templates.json`**
- 8 genre templates: food, portrait, product, cinematic, 3d, japanese, poster, app
- Each template has placeholder `{subject}` for user's input
- Includes modifiers: photorealistic, dramatic, soft, vintage, minimal, vibrant

---

## 5. Testing & Validation

### Test 1: Basic Image Generation

```bash
node gen.js "beautiful sunset over mountains with purple and orange colors"
```
**Result:** ✅ 930KB JPEG saved

### Test 2: Multiple Prompts (Before Plugin)

Generated 5 images with simple prompts:
- Cyberpunk city
- Fantasy dragon
- Underwater scene
- Japanese garden
- Space nebula

**All successful.** Images were high quality but prompts weren't optimized.

### Test 3: Fresh Opus Subagents with Smart Genre Flow

Spawned 3 parallel Opus subagents to test the full plugin workflow:

1. **Cyberpunk Samurai**
   - Genre detected: Cinematic
   - Techniques applied: Volumetric lighting, plasma blade, circuit patterns
   - Result: Much more detailed than simple prompt

2. **Astronaut on Mars**
   - Genre detected: Cinematic
   - Techniques applied: God rays, ARRI Alexa quality, dust dynamics
   - Result: Dramatic improvement

3. **Fantasy Dragon**
   - Genre detected: Cinematic
   - Techniques applied: Scale textures, wing membrane veins, smoke from nostrils
   - Result: Film-quality output

### Test 4: Lightweight Haiku Agent

```
Prompt: "cute robot holding flower"
Model: haiku
Result: ✅ Generated in ~2K tokens (vs 50K with full skill)
```

**Proved the lightweight agent architecture works.**

---

## 6. Optimization: Lightweight Agent

### Problem Statement

Using the full skill loaded 50K+ tokens into context for each image generation. This is:
- Expensive (Opus tokens)
- Slow (loading time)
- Wasteful (context pollution)

### Solution Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    MAIN CONTEXT                         │
│                                                         │
│  User: "generate a cute robot with flower"              │
│                     ↓                                   │
│  Claude: Spawns image-gen agent (~500 tokens)           │
│                     ↓                                   │
│  ┌─────────────────────────────────────────┐           │
│  │         IMAGE-GEN AGENT (haiku)         │           │
│  │                                         │           │
│  │  1. Detect genre: 3D                    │           │
│  │  2. Apply rules (embedded in agent)     │           │
│  │  3. Execute gen.js                      │           │
│  │  4. Return: "✅ robot.jpg"              │           │
│  │                                         │           │
│  └─────────────────────────────────────────┘           │
│                     ↓                                   │
│  Result: "Generated robot.jpg" (~100 tokens)            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Benefits

| Metric | Before | After |
|--------|--------|-------|
| Context used | ~50K tokens | ~500 tokens |
| Cost per image | High (Opus) | Low (Haiku) |
| Main context pollution | Heavy | Minimal |
| Iteration capability | Bloats context | Fresh agent each time |

---

## 7. GitHub Release

### Repository

**URL:** https://github.com/AryanXPatel/gemini-image-gen

### Commits

```
a8bf5f7 feat: gemini-image-gen plugin for Claude Code
```

### Files Published

- Full plugin with all components
- MIT License
- Contributing guidelines
- Environment example
- Comprehensive README

### Installation

```bash
# Option 1: Direct API
export GEMINI_API_KEY=your_key
git clone https://github.com/AryanXPatel/gemini-image-gen.git
cp -r gemini-image-gen ~/.claude/plugins/

# Option 2: With Proxy
# Start antigravity-claude-proxy first
cp -r gemini-image-gen ~/.claude/plugins/
```

---

## 8. Key Learnings

### What Worked Well

1. **Starting with working code** - Tested API before building plugin
2. **Research-driven development** - 6 rules from 1,186 prompts analysis
3. **Iterative architecture** - Discovered context bloat, fixed with agents
4. **Dual API support** - Makes plugin accessible to more users

### Challenges Overcome

1. **Windows path issues** - Used forward slashes and proper escaping
2. **Git submodule conflict** - Excluded nanobanana repo with .gitignore
3. **Context bloat** - Solved with lightweight agent architecture
4. **Model confusion** - Ensured `gemini-3-pro-image` is default

### Technical Insights

1. **Gemini 3 Pro Image response format:**
   - Returns `thinking` block with reasoning
   - Returns `image` block with base64 data
   - JPEG format, ~700KB-1.2MB per image

2. **Effective prompt structure:**
   - Subject → Visual Style → Lighting → Technical → Constraints
   - Genre-specific techniques matter significantly

3. **Agent architecture for plugins:**
   - Embed core knowledge in agent definition
   - Spawn with haiku for cost efficiency
   - Return minimal result to main context

---

## 9. Future Improvements

### Potential Enhancements

1. **Batch generation** - Generate multiple images in parallel
2. **Image-to-image** - Support input images for style transfer
3. **Aspect ratio control** - Add --aspect flag (16:9, 1:1, 4:3, etc.)
4. **Style presets** - Quick styles like --anime, --photorealistic, --oil-painting
5. **History/gallery** - Track generated images with metadata
6. **Refinement chain** - Better iteration on previous generations

### Marketplace Submission

To submit to Claude Code marketplace:
1. Add GitHub topics: `claude-code`, `plugin`, `gemini`, `image-generation`
2. Follow marketplace submission process
3. May need additional manifest files

### Community Contributions

- More genre templates
- Additional terminology banks
- Improved optimization rules
- Support for more models

---

## Appendix: Commands Reference

### Generate Image
```
/image a bowl of ramen
/image --template food "steaming ramen"
/image --raw "exact prompt without optimization"
/image --refine "make it more dramatic"
```

### Test Generation Script
```bash
# With API key
export GEMINI_API_KEY=xxx
node scripts/gen.js "your prompt"

# With proxy
node scripts/gen.js "your prompt"
```

### Check Proxy Status
```bash
curl http://localhost:8080/health
```

---

*Documentation created: February 3, 2026*
*Last updated: February 3, 2026*
