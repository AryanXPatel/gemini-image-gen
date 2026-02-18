# How to Create Your Own Skill from Antigravity + Data Source

This guide explains how this repository turned the **antigravity-claude-proxy** (for Gemini API access) and **nanobanana-trending-prompts** (viral prompt dataset) into a fully functional Claude Code skill.

## Understanding the Components

### 1. Antigravity Claude Proxy
- **What it is**: A proxy server that provides Claude Code with access to external AI services (like Google's Gemini)
- **Why we need it**: Claude Code can't directly access external APIs, so the proxy acts as a bridge
- **In this plugin**: Provides access to Gemini 3 Pro Image model

### 2. Nanobanana Trending Prompts
- **What it is**: A dataset of 1,186 viral AI-generated image prompts
- **Why we need it**: Provides patterns and best practices for prompt optimization
- **In this plugin**: Analyzed to extract 6 core optimization rules

### 3. Claude Code Skill
- **What it is**: A reusable knowledge module that Claude can invoke
- **Why we need it**: Encapsulates expertise (prompt optimization) in a lightweight format
- **In this plugin**: The `prompt-mastery` skill teaches Claude how to optimize prompts

## The Skill Architecture

```
gemini-image-gen/                    # Your plugin root
├── .claude-plugin/
│   └── plugin.json                  # Plugin metadata and configuration
├── skills/                          # Where skills live
│   └── prompt-mastery/              # Your skill folder
│       ├── SKILL.md                 # The skill definition (REQUIRED)
│       └── references/              # Supporting documentation
│           ├── scene-guide.md
│           ├── terminology.md
│           └── top-prompts.md
├── commands/                        # Slash commands
│   └── image.md                     # The /image command
├── agents/                          # Lightweight agents
│   └── image-gen.md                 # Image generation agent
├── scripts/                         # Helper scripts
│   └── gen.js                       # Node.js script to call the API
└── data/                            # Your dataset
    ├── prompts-by-category.json     # Categorized prompts
    ├── templates.json               # Genre templates
    └── top-prompts.json             # Best performers
```

## Step-by-Step: Building Your Own Skill

### Step 1: Set Up the Basic Plugin Structure

1. **Create the plugin directory:**
```bash
mkdir my-skill-plugin
cd my-skill-plugin
```

2. **Create the plugin manifest:**
```json
// .claude-plugin/plugin.json
{
  "name": "my-skill-plugin",
  "version": "1.0.0",
  "description": "Your plugin description",
  "author": {
    "name": "Your Name",
    "github": "YourGitHub"
  },
  "homepage": "https://github.com/YourGitHub/my-skill-plugin",
  "repository": "https://github.com/YourGitHub/my-skill-plugin",
  "license": "MIT",
  "keywords": ["skill", "ai", "your-keywords"]
}
```

### Step 2: Extract Knowledge from Your Data Source

For this plugin, we analyzed the nanobanana dataset to extract patterns. You should:

1. **Identify patterns** in your data source
   - What makes successful outputs?
   - What are common techniques?
   - What should be avoided?

2. **Codify rules** (like our 6 optimization rules)
   - Professional Terms Over Feeling Words
   - Quantified Parameters Over Adjectives
   - Negative Constraints
   - Sensory Stacking
   - Group and Cluster
   - Format Adaptation

3. **Create templates** for different scenarios
   - Genre-specific patterns (food, portrait, product, etc.)
   - Reusable structures
   - Example transformations

### Step 3: Create the Skill

Create `skills/your-skill-name/SKILL.md`:

```markdown
---
name: your-skill-name
description: When should this skill be used? What problems does it solve? What keywords should trigger it?
version: 1.0.0
---

# Your Skill Name

Brief introduction to what this skill does.

## Core Rules/Principles

### Rule 1: First Key Concept
Explanation...

### Rule 2: Second Key Concept
Explanation...

## Usage Patterns

### Pattern 1: Common Scenario
How to apply the skill...

## Examples

Show before/after transformations...

## Reference Files

Point to supporting documentation in the references folder.
```

**Key components of a good skill:**
- **Clear trigger conditions** in the description (when to use it)
- **Actionable rules** (not just theory)
- **Concrete examples** (show don't tell)
- **Reference materials** (detailed data in separate files)

### Step 4: Add Reference Materials

Create `skills/your-skill-name/references/` folder with supporting docs:

```markdown
// references/detailed-guide.md
# Detailed Implementation Guide

Step-by-step instructions for complex scenarios...

// references/terminology.md
# Professional Terminology Banks

| Category | Terms |
|----------|-------|
| Photography | 90mm lens, f/1.8, bokeh |
| Lighting | Volumetric, chiaroscuro, rim light |

// references/examples.md
# Top Examples

Best examples from your dataset with analysis...
```

### Step 5: Create a Command (Optional)

If you want users to invoke your skill via a command like `/image`, create `commands/your-command.md`:

```markdown
---
name: your-command
description: What does this command do?
arguments:
  - name: prompt
    description: The main input
    required: true
  - name: --option
    description: Optional flag
    required: false
---

# Your Command

## Usage

\`\`\`
/your-command <prompt>
/your-command --option <value>
\`\`\`

## What It Does

1. Spawn a lightweight agent
2. Apply the skill (your-skill-name)
3. Process the input
4. Return results

## Implementation

\`\`\`bash
# If you need to call external scripts:
node "${CLAUDE_PLUGIN_ROOT}/scripts/your-script.js" "$PROMPT"
\`\`\`

## Examples

\`\`\`
/your-command example input
# Expected output...
\`\`\`
```

### Step 6: Connect to Your External Service (Antigravity)

If you're using the antigravity-claude-proxy or similar:

1. **Create a generation script:**
```javascript
// scripts/gen.js
const http = require('http');

const PROXY_HOST = process.env.PROXY_HOST || 'localhost';
const PROXY_PORT = process.env.PROXY_PORT || 8080;
const API_KEY = process.env.GEMINI_API_KEY;

async function generate(prompt) {
  // Option 1: Direct API call if API key is provided
  if (API_KEY) {
    // Make direct API call
    return await callApiDirectly(prompt);
  }
  
  // Option 2: Use proxy
  return await callViaProxy(prompt);
}

async function callViaProxy(prompt) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: PROXY_HOST,
      port: PROXY_PORT,
      path: '/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    
    req.on('error', reject);
    req.write(JSON.stringify({ prompt }));
    req.end();
  });
}

// Run if called directly
if (require.main === module) {
  const prompt = process.argv[2];
  generate(prompt).then(console.log).catch(console.error);
}

module.exports = { generate };
```

2. **Document setup in README:**
```markdown
## Setup

### Option 1: Direct API Key
\`\`\`bash
export YOUR_API_KEY=your_key_here
\`\`\`

### Option 2: Via Proxy
\`\`\`bash
cd antigravity-claude-proxy
npm start
\`\`\`
```

### Step 7: Add Data Files

Store your analyzed data in the `data/` folder:

```json
// data/categorized-examples.json
{
  "category1": [
    {
      "prompt": "Example prompt",
      "score": 1500,
      "techniques": ["technique1", "technique2"]
    }
  ],
  "category2": [...]
}

// data/templates.json
{
  "category1": {
    "structure": "Template structure here...",
    "techniques": ["list", "of", "techniques"]
  }
}
```

## Key Design Principles

### 1. Keep Skills Lightweight
- **Do**: Provide clear rules and patterns
- **Don't**: Include massive amounts of data directly in SKILL.md
- **Why**: Skills should be fast to load and parse

### 2. Separate Concerns
- **Skill**: The knowledge (how to optimize)
- **Command**: The interface (how users invoke it)
- **Agent**: The executor (how it gets done)
- **Script**: The integration (how it calls APIs)

### 3. Make It Discoverable
- Use clear descriptions with keyword triggers
- Provide multiple examples
- Document all options and flags

### 4. Support Multiple Use Cases
- Direct command usage (`/image prompt`)
- Skill invocation (Claude asks itself)
- Template mode (`/image --template food`)
- Raw mode (`/image --raw "exact prompt"`)

## Testing Your Skill

### 1. Install the Plugin
```bash
cp -r my-skill-plugin ~/.claude/plugins/
```

### 2. Test the Skill
Ask Claude: "Can you help me with [skill-related task]?"
The skill should auto-trigger based on the description.

### 3. Test the Command
```bash
/your-command test input
```

### 4. Verify External Integration
Check that the proxy/API connection works:
```bash
node scripts/your-script.js "test"
```

## Real-World Example: This Plugin

### What We Had
1. **Antigravity proxy** providing Gemini API access
2. **Nanobanana dataset** with 1,186 viral prompts
3. **Goal**: Make it easy to generate optimized images

### What We Built
1. **Extracted 6 rules** from the dataset analysis
2. **Created prompt-mastery skill** to teach optimization
3. **Built /image command** for easy invocation
4. **Added image-gen agent** for lightweight processing
5. **Created gen.js script** to call Gemini via proxy/API
6. **Organized data** into categorized JSON files

### The Result

**Flow Diagram:**
```
┌─────────────────────────────────────────────────────────────────┐
│                          User Input                              │
│                    /image a bowl of ramen                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    1. Command (image.md)                         │
│              Parses arguments, spawns agent                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   2. Agent (image-gen.md)                        │
│           Lightweight Haiku agent with embedded rules            │
│          - Detects genre (food)                                  │
│          - Loads templates from data/                            │
│          - Applies prompt-mastery skill knowledge                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              3. Skill (prompt-mastery/SKILL.md)                  │
│                   Optimizes prompt:                              │
│    "a bowl of ramen" → "Steaming bowl of authentic Japanese     │
│     tonkotsu ramen, 45° overhead, 85mm f/2.8, steam wisps..."   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   4. Script (scripts/gen.js)                     │
│               Calls external API with prompt                     │
│                                                                   │
│    ┌─────────────────┐              ┌─────────────────┐        │
│    │  Direct API?    │──Yes──►      │  Google AI      │        │
│    │ (GEMINI_API_KEY)│              │  Studio API     │        │
│    └────────┬────────┘              └─────────────────┘        │
│             │No                                                  │
│             ▼                                                    │
│    ┌─────────────────┐              ┌─────────────────┐        │
│    │  Proxy Mode     │──►           │  Antigravity    │        │
│    │  (localhost)    │              │  Claude Proxy   │        │
│    └─────────────────┘              └─────────────────┘        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    5. Gemini API Response                        │
│                  Image data (base64/URL)                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    6. Save & Return Result                       │
│           Image saved to disk, path returned to user             │
└─────────────────────────────────────────────────────────────────┘
```

**Data Flow:**
```
nanobanana dataset → analysis → 6 optimization rules
                                      ↓
                           prompt-mastery skill
                                      ↓
                           embedded in agent & references
                                      ↓
                           applied to user prompts
```

## Advanced Tips

### Dynamic Template Loading
```markdown
Read `${CLAUDE_PLUGIN_ROOT}/data/templates.json` and apply genre-specific patterns.
```

### Multi-Step Workflows
```markdown
1. Detect genre from input
2. Load genre-specific examples
3. Apply optimization rules
4. Validate constraints
5. Generate output
```

### Error Handling
```markdown
If proxy connection fails, fall back to direct API.
If API key missing, provide helpful setup instructions.
```

## Common Pitfalls

❌ **Too much data in SKILL.md**
- Keep it under 5KB for fast loading
- Move detailed data to reference files

❌ **Vague trigger conditions**
- Be specific about when skill should activate
- Include keyword examples

❌ **No concrete examples**
- Always show before/after transformations
- Include edge cases

❌ **Hardcoded values**
- Use environment variables for configuration
- Support multiple setup options

## Next Steps

1. **Analyze your data source** - What patterns can you extract?
2. **Define your skill** - What knowledge should it contain?
3. **Build the structure** - Follow the template above
4. **Test thoroughly** - Verify all components work together
5. **Document well** - Clear README and examples
6. **Share with community** - Publish to Claude Code marketplace

## Additional Resources

- **This plugin's structure**: Use as a reference implementation
- **Claude Code documentation**: Plugin development guide
- **Antigravity proxy**: https://github.com/anthropics/antigravity-claude-proxy
- **Skill best practices**: See `docs/ARCHITECTURE-DECISIONS.md`

---

**Questions?** Open an issue on the repository!

**Want to contribute?** See `CONTRIBUTING.md`
