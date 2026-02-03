# Contributing to Gemini Image Gen

Thank you for your interest in contributing!

## Ways to Contribute

### 1. Add New Prompts
- Find viral image prompts with high engagement
- Extract techniques and patterns
- Add to `data/prompts-by-category.json`

### 2. Improve Optimization Rules
- Test the 6 rules against different scenarios
- Suggest improvements based on results
- Update `skills/prompt-mastery/SKILL.md`

### 3. Add Genre Templates
- Create new templates in `data/templates.json`
- Document patterns in `skills/prompt-mastery/references/scene-guide.md`

### 4. Fix Bugs
- Check issues for reported bugs
- Submit PRs with fixes

## Development Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/gemini-image-gen.git
cd gemini-image-gen

# Test locally with Claude Code
claude --plugin-dir .

# Test image generation
export GEMINI_API_KEY=your_key_here
node scripts/gen.js "test prompt"
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear message: `git commit -m "feat: add new template"`
6. Push and create PR

## Code Style

- Use clear, descriptive names
- Add comments for complex logic
- Keep functions focused and small
- Test before submitting

## Questions?

Open an issue for discussion!
