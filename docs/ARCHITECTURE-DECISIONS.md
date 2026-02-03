# Architecture Decision Records

This document captures key architectural decisions made during plugin development.

---

## ADR-001: Plugin over Skill or MCP Server

**Status:** Accepted
**Date:** 2026-02-03

### Context

We needed to decide how to package the image generation functionality for Claude Code.

### Options Considered

1. **Skill only** - Single markdown file with instructions
2. **Full Plugin** - Package with commands, agents, skills, data
3. **MCP Server** - Native tool integration

### Decision

**Chose: Full Plugin**

### Rationale

- Need `/image` command for quick user access
- Need dedicated agent for autonomous generation
- Need skill for deep learning (optional)
- Need data files (templates, prompts database)
- Plugin structure supports all components

### Consequences

- More complex structure to maintain
- But more flexible and feature-rich
- Users can use command OR skill OR agent

---

## ADR-002: Lightweight Agent Architecture

**Status:** Accepted
**Date:** 2026-02-03

### Context

Initial implementation loaded the full prompt-mastery skill (~50K tokens) into main context for each image generation. This was expensive and polluted context.

### Options Considered

1. **Keep full skill loading** - Accept the cost
2. **Compress skill** - Reduce to essentials
3. **Dedicated agent** - Embed rules in agent, spawn on demand

### Decision

**Chose: Dedicated agent with embedded rules**

### Rationale

- Agent has rules embedded in its definition
- Spawned with haiku model (cheap, fast)
- Main context only sees spawn + result (~500 tokens)
- Each generation is isolated, no context pollution
- Can iterate without bloating main context

### Consequences

- Agent definition is larger (contains all rules)
- But each invocation is cheap and clean
- Skill remains available for deep learning if needed

---

## ADR-003: Dual API Support (Direct + Proxy)

**Status:** Accepted
**Date:** 2026-02-03

### Context

Original implementation only worked with antigravity-claude-proxy. We wanted broader accessibility.

### Options Considered

1. **Proxy only** - Require users to set up proxy
2. **Direct API only** - Require Google AI Studio key
3. **Both** - Support either mode

### Decision

**Chose: Both modes with auto-detection**

### Implementation

```javascript
if (process.env.GEMINI_API_KEY) {
  generateWithDirectAPI(prompt);
} else {
  generateWithProxy(prompt);
}
```

### Rationale

- Direct API is simpler for most users
- Proxy supports multi-account, rate limit management
- Auto-detection means zero config for proxy users
- One env var switches to direct mode

### Consequences

- More code to maintain (two API paths)
- But much broader accessibility
- Users choose based on their needs

---

## ADR-004: Smart Genre Detection

**Status:** Accepted
**Date:** 2026-02-03

### Context

Different image types benefit from different optimization patterns. Food needs warm tones and 45° angles. Portraits need 90mm lens and skin texture. We wanted automatic application of genre-specific techniques.

### Options Considered

1. **One-size-fits-all** - Same optimization for all prompts
2. **User-specified genre** - Require --template flag
3. **Auto-detection** - Detect genre from prompt keywords

### Decision

**Chose: Auto-detection with optional override**

### Implementation

| Genre | Trigger Keywords |
|-------|------------------|
| food | dish, meal, cuisine, recipe |
| portrait | person, face, woman, man |
| product | product, packaging, brand |
| cinematic | scene, dramatic, action |
| 3d | icon, render, emoji |
| design | UI, app, poster |

### Rationale

- Most prompts clearly indicate their genre
- Automatic detection reduces friction
- `--template` flag allows override if needed
- Techniques from top prompts in each genre

### Consequences

- May occasionally misdetect genre
- But user can override with --template
- Significantly improves output quality for matched genres

---

## ADR-005: Data Structure for Prompts

**Status:** Accepted
**Date:** 2026-02-03

### Context

We had 1,186 viral prompts to learn from. Needed to structure them for efficient use.

### Options Considered

1. **Raw prompts only** - Just store the text
2. **Prompts + metadata** - Include likes, categories
3. **Prompts + extracted techniques** - Include learnable patterns

### Decision

**Chose: Prompts with extracted techniques**

### Structure

```json
{
  "food": [
    {
      "rank": 1,
      "likes": 1034,
      "prompt": "truncated prompt text...",
      "techniques": [
        "rim/backlighting",
        "depth of field",
        "artificial lighting"
      ]
    }
  ]
}
```

### Rationale

- Techniques are learnable, reusable patterns
- Categories enable genre-specific optimization
- Rank/likes indicate proven quality
- Truncated prompts save space while preserving patterns

### Consequences

- Required extraction work upfront
- But enables smart technique application
- 90 prompts × 5 techniques = 450 patterns to learn from

---

## ADR-006: Model Selection (gemini-3-pro-image)

**Status:** Accepted
**Date:** 2026-02-03

### Context

Multiple Gemini models are available. Need to choose default for image generation.

### Options Considered

1. `gemini-2.0-flash-exp` - Fast, general purpose
2. `gemini-3-pro-high` - High quality text/reasoning
3. `gemini-3-pro-image` - Dedicated image generation

### Decision

**Chose: `gemini-3-pro-image` as default**

### Rationale

- Purpose-built for image generation
- Available at 100% quota on proxy
- Best quality for this specific use case
- Can be overridden with GEMINI_MODEL env var

### Consequences

- Specific to 2026 model availability
- Users on older systems may need different model
- But provides best results for target use case

---

*ADRs maintained as part of project documentation*
