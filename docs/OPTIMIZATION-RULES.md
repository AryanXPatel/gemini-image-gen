# The 6 Optimization Rules - Deep Dive

This document provides comprehensive documentation of the 6 prompt optimization rules extracted from analyzing 1,186 viral AI-generated images.

---

## Overview

These rules were derived from:
- **Source 1:** [nanobanana-trending-prompts](https://github.com/jau123/nanobanana-trending-prompts) - 1,186 viral prompts
- **Source 2:** Reddit r/PromptEngineering analysis post

The rules transform casual prompts into professional, high-quality prompts that consistently produce better images.

---

## Rule 1: Professional Terms Over Feeling Words

### The Problem

Vague feeling words like "cinematic," "professional," or "moody" are subjective and interpreted inconsistently by AI models.

### The Solution

Replace feeling words with specific professional terminology, proper nouns, brand names, or artist names.

### Transformation Examples

| Feeling Word | Professional Term |
|--------------|-------------------|
| Cinematic, vintage | Wong Kar-wai aesthetics, Saul Leiter style |
| Film look, retro | Kodak Vision3 500T, Cinestill 800T |
| Warm tones | Sakura Pink, Golden Hour warmth |
| Professional | Annie Leibovitz style, Hasselblad quality |
| Moody | Chiaroscuro lighting, Film noir aesthetic |
| Japanese style | Wabi-sabi aesthetics, MUJI visual language |
| High-end design | Swiss International Style, Bauhaus functionalism |

### Terminology Banks

**Photographers:**
- Annie Leibovitz (iconic portraits)
- Christopher Doyle (Wong Kar-wai cinematography)
- Saul Leiter (through-window street photography)
- Roger Deakins (epic landscapes, natural light)

**Film Stocks:**
- Kodak Vision3 500T (cinematic warmth)
- Cinestill 800T (neon halos, night photography)
- Kodak Portra 400 (soft skin tones)
- Fujifilm Velvia 50 (extreme saturation)

**Aesthetics:**
- Wabi-sabi (beauty in imperfection)
- Bauhaus (functional geometry)
- Swiss International Style (clean grid systems)
- Art Deco (geometric luxury)

---

## Rule 2: Quantified Parameters Over Adjectives

### The Problem

Adjectives like "blurry background," "professional lighting," or "close-up" are imprecise.

### The Solution

Use exact technical parameters with numerical values.

### Transformation Examples

| Adjective | Quantified Parameter |
|-----------|---------------------|
| Professional photo | 90mm lens, f/1.8, high dynamic range |
| From above | 45-degree overhead angle |
| Soft lighting | Soft side backlight, diffused light |
| Blurred background | Shallow depth of field, f/1.4 bokeh |
| Dramatic | Volumetric light, chiaroscuro contrast |
| Wide shot | 16mm wide-angle lens |
| Close-up | 100mm macro lens |
| High quality | 8K resolution, RAW capture |

### Technical Reference

**Lens Focal Lengths:**
- 14-24mm: Extreme wide, architecture
- 35mm: Street photography, environmental
- 50mm: Natural perspective
- 85-90mm: Portrait, flattering compression
- 100mm macro: Close-up detail
- 200mm+: Telephoto compression

**Aperture Effects:**
- f/1.4-2: Extreme bokeh, isolated subject
- f/2.8-4: Moderate blur, subject separation
- f/5.6-8: Sharp throughout, product photography
- f/11-16: Deep focus, landscapes

---

## Rule 3: Negative Constraints

### The Problem

AI models may include unwanted elements (text, watermarks, distortions) unless explicitly told not to.

### The Solution

Add explicit prohibitions at the end of prompts.

### Common Constraints

**Universal:**
- No text or words allowed
- No watermarks or logos
- No artificial distortions

**Portrait-specific:**
- Maintain realistic facial features
- Preserve identity characteristics
- Do not obscure face

**Product-specific:**
- Product must not be distorted or warped
- Maintain accurate proportions
- No redesigning the product

**Food-specific:**
- No utensils in frame
- Maintain appetizing color temperature
- No artificial plastic textures

**Design-specific:**
- Clear information hierarchy
- No decorative clutter
- No low-resolution elements

---

## Rule 4: Sensory Stacking

### The Problem

Visual-only descriptions produce flat, less engaging images.

### The Solution

Add multiple sensory dimensions beyond just visual.

### Sensory Layers

**Visual (baseline):**
- Color palette
- Light and shadow
- Composition

**Tactile:**
- "Texture feels tangible"
- "Soft velvet surface"
- "Rough hewn texture"
- "Delicate gossamer quality"

**Olfactory:**
- "Aroma penetrates the frame"
- "Fresh morning dew scent"
- "Warm baked goods fragrance"

**Motion:**
- "Steam wisps rising"
- "Fabric gently flowing"
- "Hair caught mid-movement"
- "Dust motes floating"

**Temperature:**
- "Steamy warmth"
- "Crisp cold air"
- "Cozy fireplace warmth"
- "Frozen crystalline cold"

### Example Application

**Before:** "A bowl of ramen"

**After (with sensory stacking):**
"Steam wisps rising and curling from the rich broth. Noodles glisten with oily sheen. Chashu pork with caramelized edges that look tender to the touch. The aroma of garlic, sesame, and pork bone seems to penetrate the frame. A sense of steamy warmth emanates from the bowl."

---

## Rule 5: Group and Cluster

### The Problem

Complex prompts become chaotic and hard to parse.

### The Solution

Organize information into logical groups with clear headers.

### Standard Grouping Pattern

```
[Subject Description]

Visual Style:
[Aesthetic references, color palette, artistic style]

Lighting & Atmosphere:
[Light sources, quality, mood, environmental conditions]

Technical Parameters:
[Lens, aperture, film stock, resolution]

Sensory Details:
[Texture, motion, temperature, aroma - from Rule 4]

Constraints:
[What to avoid, what to preserve - from Rule 3]
```

### When to Use Grouping

- **Complex scenes** with multiple elements
- **Multi-subject** compositions
- **Specific technical requirements**
- **Strong stylistic references**

---

## Rule 6: Format Adaptation

### The Problem

One format doesn't fit all prompts.

### The Solution

Choose format based on complexity.

### Format Selection Guide

**Simple Scenes (single subject):**
- Use natural language paragraphs
- 2-3 sentences sufficient
- Example: Product shot on white background

**Medium Complexity:**
- Use light structure with 2-3 sections
- Example: Portrait with specific mood

**Complex Scenes:**
- Use full grouping structure (Rule 5)
- Multiple sections with headers
- Example: Cinematic scene with multiple elements

**Highly Technical:**
- Consider JSON format
- Nested parameters for precise control
- Example: Detailed character with exact specifications

### JSON Format (Advanced)

For extremely detailed prompts:

```json
{
  "subject": {
    "type": "portrait",
    "demographics": "young woman, mid-20s",
    "expression": "contemplative"
  },
  "technical": {
    "lens": "90mm",
    "aperture": "f/1.8",
    "film_stock": "Kodak Vision3 500T"
  },
  "lighting": {
    "key": "soft side backlight",
    "fill": "ambient window light",
    "mood": "dreamy, nostalgic"
  },
  "constraints": [
    "maintain realistic features",
    "no text",
    "no watermarks"
  ]
}
```

---

## Genre-Specific Application

### Food Photography

**Priority rules:** Rule 4 (sensory), Rule 2 (angles)

**Key techniques:**
- 45-degree overhead angle
- Soft side backlight
- Steam visualization
- Warm color temperature (3200-4000K)
- Macro details on textures

### Portrait Photography

**Priority rules:** Rule 1 (photographers), Rule 2 (lens/aperture)

**Key techniques:**
- 85-90mm lens, f/1.8
- Rim lighting for separation
- Skin texture description
- Film stock reference
- Emotional expression detail

### Product Photography

**Priority rules:** Rule 3 (constraints), Rule 2 (technical)

**Key techniques:**
- Studio lighting setup
- High-key or contextual background
- 100mm lens, f/8 for sharpness
- Floating/levitating composition
- No product distortion

### Cinematic

**Priority rules:** Rule 1 (directors/DPs), Rule 5 (grouping)

**Key techniques:**
- Anamorphic lens reference
- Volumetric lighting
- Chiaroscuro contrast
- Film stock color science
- Atmospheric elements (rain, fog, dust)

---

## Quick Reference Card

| Rule | One-liner |
|------|-----------|
| 1 | Wong Kar-wai > "cinematic" |
| 2 | 90mm f/1.8 > "professional" |
| 3 | "No text, no watermarks" |
| 4 | Steam, texture, warmth |
| 5 | Subject / Style / Light / Tech / Constraints |
| 6 | Simple = paragraph, Complex = structured |

---

*This document is part of the gemini-image-gen plugin documentation.*
