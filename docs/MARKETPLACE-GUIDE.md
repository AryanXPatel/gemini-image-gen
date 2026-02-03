# Publishing to Claude Code Marketplace

A step-by-step guide to publishing your `gemini-image-gen` plugin.

---

## Table of Contents

1. [How Claude Code Plugins Work](#how-claude-code-plugins-work)
2. [Pre-Publication Checklist](#pre-publication-checklist)
3. [Step 1: Update plugin.json](#step-1-update-pluginjson)
4. [Step 2: Fix README Issues](#step-2-fix-readme-issues)
5. [Step 3: Create Your Marketplace](#step-3-create-your-marketplace)
6. [Step 4: Test Locally](#step-4-test-locally)
7. [Step 5: Publish & Share](#step-5-publish--share)
8. [Optional: Request Official Inclusion](#optional-request-official-inclusion)

---

## How Claude Code Plugins Work

Claude Code uses a **decentralized marketplace model**:

| Type | Description | Example |
|------|-------------|---------|
| **Official** | Maintained by Anthropic | `serena@claude-plugins-official` |
| **Custom Marketplace** | You create & host | `gemini-image-gen@aryanxpatel` |
| **Local** | Direct install to `~/.claude/plugins/` | Manual copy |

**There is no central submission process.** You create your own marketplace repo, and users add it.

---

## Pre-Publication Checklist

- [ ] Plugin works locally (tested `/image` command)
- [ ] `plugin.json` has all required fields
- [ ] README has correct installation instructions
- [ ] No hardcoded paths in code
- [ ] LICENSE file exists
- [ ] GitHub repo is public

---

## Step 1: Update plugin.json

Edit `.claude-plugin/plugin.json`:

```json
{
  "name": "gemini-image-gen",
  "version": "1.0.0",
  "description": "Generate images using Google's Gemini 3 Pro with viral prompt optimization",
  "author": {
    "name": "Aryan Patel",
    "email": "your-email@example.com"
  },
  "homepage": "https://github.com/AryanXPatel/gemini-image-gen",
  "repository": "https://github.com/AryanXPatel/gemini-image-gen",
  "license": "MIT",
  "keywords": ["image-generation", "gemini", "ai-art", "prompt-engineering"]
}
```

### Required Fields

| Field | Purpose |
|-------|---------|
| `name` | Unique plugin identifier |
| `version` | Semantic version (1.0.0) |
| `description` | What it does (shown in marketplace) |
| `author.name` | Your name |
| `repository` | GitHub URL for source |
| `license` | MIT, Apache-2.0, etc. |

---

## Step 2: Fix README Issues

### Issue 1: Typo on Line 61

**Before:**
```bash
cp -r gemini-image-gen ~/. claude/plugins/
```

**After:**
```bash
cp -r gemini-image-gen ~/.claude/plugins/
```

### Issue 2: Marketplace Section (Lines 82-86)

**Before:**
```markdown
### From Claude Code Marketplace

/plugin install gemini-image-gen
```

**After:**
```markdown
### Via Marketplace

# First, add the marketplace
/plugin marketplace add AryanXPatel/gemini-image-gen-marketplace

# Then install the plugin
/plugin install gemini-image-gen@aryanxpatel
```

### Issue 3: Remove Fake Proxy URL (Line 160)

Remove or replace `antigravity-claude-proxy` reference with actual proxy instructions or remove entirely.

---

## Step 3: Create Your Marketplace

### 3.1 Create a New GitHub Repo

Name: `gemini-image-gen-marketplace`

### 3.2 Create Directory Structure

```
gemini-image-gen-marketplace/
├── .claude-plugin/
│   └── marketplace.json
└── README.md
```

### 3.3 Create marketplace.json

File: `.claude-plugin/marketplace.json`

```json
{
  "name": "aryanxpatel",
  "owner": {
    "name": "Aryan Patel",
    "email": "your-email@example.com"
  },
  "metadata": {
    "description": "AI image generation and creative tools for Claude Code",
    "website": "https://github.com/AryanXPatel"
  },
  "plugins": [
    {
      "name": "gemini-image-gen",
      "source": {
        "source": "github",
        "repo": "AryanXPatel/gemini-image-gen"
      },
      "description": "Generate stunning images using Gemini 3 Pro with viral prompt optimization",
      "version": "1.0.0",
      "category": "ai-tools",
      "keywords": ["image", "gemini", "ai-art", "prompt-engineering"],
      "featured": true
    }
  ]
}
```

### 3.4 Create Marketplace README

File: `README.md`

```markdown
# Aryan Patel's Claude Code Plugins

A collection of AI-powered plugins for Claude Code.

## Available Plugins

| Plugin | Description |
|--------|-------------|
| [gemini-image-gen](https://github.com/AryanXPatel/gemini-image-gen) | Generate images with Gemini 3 Pro |

## Installation

### Add This Marketplace

```bash
/plugin marketplace add AryanXPatel/gemini-image-gen-marketplace
```

### Install a Plugin

```bash
/plugin install gemini-image-gen@aryanxpatel
```

## License

MIT
```

### 3.5 Push to GitHub

```bash
cd gemini-image-gen-marketplace
git init
git add .
git commit -m "Initial marketplace setup"
git remote add origin https://github.com/AryanXPatel/gemini-image-gen-marketplace.git
git push -u origin main
```

---

## Step 4: Test Locally

### 4.1 Test Plugin Installation

```bash
# Copy to plugins directory
cp -r /d/dev/claude-google-image/gemini-image-gen ~/.claude/plugins/

# Start Claude Code
claude

# Test the command
/image a bowl of ramen
```

### 4.2 Test Direct Script

```bash
# With API key
export GEMINI_API_KEY=your_key_here
node scripts/gen.js "a cute robot"

# With proxy (if running)
node scripts/gen.js "a cute robot"
```

### 4.3 Validate Plugin Structure

```bash
# In Claude Code
/plugin validate ./gemini-image-gen
```

---

## Step 5: Publish & Share

### 5.1 Ensure Both Repos Are Public

- [ ] `AryanXPatel/gemini-image-gen` - Public
- [ ] `AryanXPatel/gemini-image-gen-marketplace` - Public

### 5.2 Share Installation Instructions

```markdown
## Quick Install

1. Add marketplace:
   ```
   /plugin marketplace add AryanXPatel/gemini-image-gen-marketplace
   ```

2. Install plugin:
   ```
   /plugin install gemini-image-gen@aryanxpatel
   ```

3. Set your API key:
   ```bash
   export GEMINI_API_KEY=your_key_here
   ```

4. Use it:
   ```
   /image a cyberpunk city at night
   ```
```

### 5.3 Share on Communities

- Claude Code Discord
- Twitter/X with #ClaudeCode
- Reddit r/ClaudeAI
- GitHub Discussions

---

## Optional: Request Official Inclusion

There's no guaranteed path to the official marketplace, but you can try:

### Option 1: Use Feedback Command

In Claude Code:
```
/feedback

I've created a plugin called gemini-image-gen that enables image generation
using Gemini 3 Pro. It includes prompt optimization based on 1,186 viral
prompts. Would this be considered for the official marketplace?

GitHub: https://github.com/AryanXPatel/gemini-image-gen
```

### Option 2: Build Community Adoption

High-quality plugins with many users may be noticed and considered for official inclusion.

### Timeline Expectations

| Goal | Timeline |
|------|----------|
| Local testing | Immediate |
| Public marketplace | 1-2 hours |
| Community adoption | Weeks to months |
| Official inclusion | Unknown (no guarantee) |

---

## Updating Your Plugin

When you release updates:

### 1. Update Version

In `plugin.json`:
```json
"version": "1.1.0"
```

### 2. Update Marketplace

In `marketplace.json`:
```json
"version": "1.1.0"
```

### 3. Push Both Repos

```bash
# Plugin repo
git add . && git commit -m "v1.1.0: New feature X" && git push

# Marketplace repo
git add . && git commit -m "Update gemini-image-gen to v1.1.0" && git push
```

### 4. Users Update

```bash
/plugin update gemini-image-gen@aryanxpatel
```

---

## Troubleshooting

### Plugin Not Found

```bash
# Check it's in the right location
ls ~/.claude/plugins/gemini-image-gen

# Check plugin.json exists
cat ~/.claude/plugins/gemini-image-gen/.claude-plugin/plugin.json
```

### Command Not Working

```bash
# Check command file exists
cat ~/.claude/plugins/gemini-image-gen/commands/image.md

# Test script directly
node ~/.claude/plugins/gemini-image-gen/scripts/gen.js "test prompt"
```

### API Errors

```bash
# Verify API key is set
echo $GEMINI_API_KEY

# Test direct API call
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Generate an image: a red apple"}]}]}'
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Add marketplace | `/plugin marketplace add AryanXPatel/gemini-image-gen-marketplace` |
| Install plugin | `/plugin install gemini-image-gen@aryanxpatel` |
| Update plugin | `/plugin update gemini-image-gen@aryanxpatel` |
| Remove plugin | `/plugin uninstall gemini-image-gen@aryanxpatel` |
| List installed | `/plugin list` |
| Validate | `/plugin validate ./path` |

---

*Last updated: February 2026*
