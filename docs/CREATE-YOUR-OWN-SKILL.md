# How to Create Your Own Skill from External Systems + Data

This guide explains how to turn functionality from **external systems** (like Google's Antigravity IDE, APIs, datasets) into a fully functional Claude Code skill.

## Understanding the Pattern

This repository demonstrates converting:
- **External API access** → Google Gemini image generation via API
- **External data/knowledge** → Nanobanana Pro dataset (1,186 viral prompts)
- **Into a Claude skill** → The `prompt-mastery` skill with optimization rules

### The Three Key Components

### 1. External System/API
- **What it is**: Any external service or IDE (like Google's Antigravity, APIs, databases)
- **Challenge**: Claude Code can't directly access external systems
- **Solution**: Create a bridge (proxy, API wrapper, or direct API calls)
- **In this plugin**: Google Gemini API (called via Node.js script)

### 2. Knowledge/Data Source
- **What it is**: Datasets, documentation, or expertise (like nanobanana pro with viral prompts)
- **Challenge**: How to distill knowledge into usable patterns
- **Solution**: Analyze data → Extract rules → Codify in skill
- **In this plugin**: 1,186 prompts analyzed → 6 optimization rules extracted

### 3. Claude Code Skill
- **What it is**: A markdown file that teaches Claude how to apply the knowledge
- **Why we need it**: Encapsulates expertise in a reusable, lightweight format
- **How it works**: Claude reads the skill and applies the rules/patterns
- **In this plugin**: The `prompt-mastery` skill teaches prompt optimization

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

### Step 6: Connect to Your External System

If you need to access external APIs, databases, or services:

1. **Create an integration script:**
```javascript
// scripts/gen.js
const https = require('https');

const API_KEY = process.env.YOUR_API_KEY;
const API_ENDPOINT = process.env.API_ENDPOINT || 'https://api.example.com';

async function callExternalAPI(input) {
  // Option 1: Direct API call with API key
  if (API_KEY) {
    return await callApiDirectly(input);
  }
  
  // Option 2: Via local proxy/bridge if you have one
  return await callViaProxy(input);
}

async function callApiDirectly(input) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.example.com',
      path: '/generate',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    
    req.on('error', reject);
    req.write(JSON.stringify({ input }));
    req.end();
  });
}

// Run if called directly
if (require.main === module) {
  const input = process.argv[2];
  callExternalAPI(input).then(console.log).catch(console.error);
}

module.exports = { callExternalAPI };
```

2. **Document setup in README:**
```markdown
## Setup

### Get Your API Key
1. Sign up at [service provider]
2. Generate an API key
3. Set it: `export YOUR_API_KEY=your_key_here`

### Test Connection
\`\`\`bash
node scripts/gen.js "test input"
\`\`\`
```

**For Google Antigravity or similar IDEs:**
- If you were using a proxy to access Antigravity, replace that with direct API calls
- Extract the knowledge/data from Antigravity into local files (JSON, markdown)
- Create a skill that codifies the patterns you learned
- Use scripts to call external APIs only when needed

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
1. **Google Gemini API** - External image generation service
2. **Nanobanana Pro dataset** - 1,186 viral AI image prompts
3. **Goal**: Make it easy to generate professionally optimized images in Claude Code

### What We Built
1. **Analyzed the dataset** → Extracted 6 core optimization rules
2. **Created prompt-mastery skill** → Teaches Claude the optimization patterns
3. **Built /image command** → Easy user interface
4. **Added image-gen agent** → Lightweight executor with embedded rules
5. **Created gen.js script** → Calls Gemini API directly
6. **Organized data** → Categorized prompts into JSON files for reference

### How It Works Together

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
│    │  Has API Key?   │──Yes──►      │  Google Gemini  │        │
│    │ (GEMINI_API_KEY)│              │  API (Direct)   │        │
│    └────────┬────────┘              └─────────────────┘        │
│             │No                                                  │
│             ▼                                                    │
│    ┌─────────────────┐                                          │
│    │  Error: Need    │                                          │
│    │  API Key        │                                          │
│    └─────────────────┘                                          │
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
External System (e.g., Google Antigravity, API, Database)
                           ↓
            Extract knowledge/data locally
                           ↓
              Analyze patterns & rules
                           ↓
          Codify into Claude Code skill
                           ↓
         Skill applied via agents/commands
                           ↓
    (Optional) Call external API for execution
```

**Example with Nanobanana Pro:**
```
Nanobanana Pro dataset → Local JSON files → Analysis → 6 rules
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
If external API fails, provide helpful error messages.
If API key missing, show setup instructions.
Cache responses when possible to reduce API calls.
```

## Converting from Other Systems

### If You Have a Proxy Setup
1. **Extract the data** - Download/export what the proxy accesses
2. **Analyze patterns** - What makes good outputs?
3. **Create local files** - Store knowledge as JSON/markdown
4. **Build the skill** - Codify the patterns
5. **Optional**: Keep API calls only for execution, not for knowledge

### If You're Using Google Antigravity
1. **Export your data** - Get prompts, configurations, examples
2. **Document patterns** - What techniques work best?
3. **Create templates** - Reusable structures
4. **Build the skill** - Teaching Claude the patterns
5. **Connect API** - Only if you need real-time execution

### If You Have Nanobanana Pro Access
1. **Analyze the prompts** - Find common patterns
2. **Extract techniques** - What makes them viral?
3. **Categorize by type** - Food, portrait, product, etc.
4. **Create rules** - Professional terms, quantified params, etc.
5. **Build templates** - Genre-specific patterns

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
- **Nanobanana**: Viral prompt datasets for analysis
- **Skill best practices**: See `docs/ARCHITECTURE-DECISIONS.md`

## Key Takeaway

**You don't need a proxy to create a skill!** 

The skill is about **knowledge**, not connectivity. Even if you had Antigravity or another system before:
1. Extract the knowledge/patterns
2. Store them locally (data files, markdown)
3. Create a skill that teaches Claude those patterns
4. Only use API calls when you need real-time execution

Most of the value is in the **skill** (the rules, patterns, techniques), not the API connection.

---

**Questions?** Open an issue on the repository!

**Want to contribute?** See `CONTRIBUTING.md`
