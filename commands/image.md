---
name: image
description: Generate images using Gemini 3 Pro Image model. Spawns a lightweight agent to keep main context clean.
arguments:
  - name: prompt
    description: The image description to generate
    required: true
---

# /image Command

Generate images using the dedicated image-gen agent. This keeps your main context clean (~500 tokens instead of 50K).

## How It Works

When you invoke `/image`, this command spawns the `image-gen` agent which:
1. Detects the genre of your request
2. Applies 6 optimization rules
3. Generates the image via Gemini 3 Pro Image
4. Returns just the result (file path + brief summary)

## Usage

```
/image a bowl of ramen
/image cyberpunk samurai in rain
/image cute robot holding flowers
```

## Execution

**Spawn the image-gen agent with the user's prompt:**

Use the Task tool to spawn the `image-gen` agent defined in this plugin:

```
Task({
  subagent_type: "general-purpose",
  model: "haiku",  // Lightweight for simple generation
  prompt: `
    You are the image-gen agent. Generate an image for: "${USER_PROMPT}"

    1. Detect genre (food/portrait/product/cinematic/3d/design)
    2. Apply optimization rules:
       - Professional terms over feeling words
       - Quantified parameters (lens, aperture)
       - Negative constraints (no text, no watermarks)
       - Sensory stacking (texture, motion, temperature)
       - Structured format for complex scenes
    3. Execute: node D:/dev/claude-google-image/gemini-image-gen/scripts/gen.js "OPTIMIZED_PROMPT"
    4. Return: filename, genre detected, 2-3 key enhancements made

    Work autonomously. Be concise.
  `
})
```

## For Iteration

If the user is not satisfied with the result:

```
/image --refine "make it more dramatic"
```

Spawns a new agent that:
1. Reads the previous image context
2. Adjusts the prompt based on feedback
3. Generates a new version

## Advanced Options

| Flag | Description |
|------|-------------|
| `--raw` | Skip optimization, use exact prompt |
| `--template [genre]` | Force a specific genre template |
| `--refine "feedback"` | Iterate on previous generation |

## Why Agent-Based?

- **Main context stays clean**: ~500 tokens vs 50K
- **Parallel generation**: Spawn multiple agents for batch generation
- **Iteration without bloat**: Each refinement is a fresh agent
- **Cost efficient**: Uses haiku model for generation orchestration
