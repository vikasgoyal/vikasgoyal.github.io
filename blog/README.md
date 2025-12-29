# Blog System - Quick Reference

## Creating a New Blog Post

### Method 1: Automated (Recommended)

1. **Create a text file** with your content (see `post-example.txt` for format):
```
---
title: Your Post Title
date: 2025-12-28
category: Technology
excerpt: Brief description for the index
tags: tag1, tag2, tag3
readTime: 5
slug: your-post-slug
---

# Your Content Here

Write naturally in markdown-style format...
```

2. **Run the script:**
```powershell
.\create-blog-post.ps1 -InputFile "your-draft.txt"
```

3. **Done!** The script automatically:
   - Creates HTML file in `blog/YYYY/MM/slug.html`
   - Converts markdown to HTML
   - Adds headers, footers, breadcrumbs
   - Updates blog index
   - Shows you the URL

### Method 2: Manual

1. Copy `post-template.html` to `blog/YYYY/MM/your-post.html`
2. Edit the file - update all placeholders
3. Run `.\generate-blog-index.ps1` to update the index
4. Commit and push

## Metadata Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | Yes | Post title | "Building Better APIs" |
| `date` | Yes | Publish date | 2025-12-28 |
| `category` | Yes | Category | Technology, Agentic AI, Startups, Career |
| `excerpt` | Yes | Short description | "Learn how to..." |
| `tags` | Yes | Comma-separated | "api, rest, design" |
| `readTime` | Yes | Minutes to read | 5 |
| `slug` | Yes (auto) | URL slug | "building-better-apis" |

## Markdown Format (Automated Method)

- `# Title` → `<h2>`
- `## Subtitle` → `<h2>`
- `### Section` → `<h3>`
- `- List item` → `<li>` (auto-wrapped in `<ul>`)
- `> Quote` → Styled blockquote
- Paragraphs auto-detected

## Tips

- Use descriptive slugs (lowercase, hyphens, no dates)
- Keep excerpts under 2 sentences
- Add 3-5 relevant tags
- Estimate read time: ~200 words per minute
- Test locally before pushing

## File Structure

```
blog/
├── README.md (this file)
├── index.html (blog homepage)
├── blog.js (dynamic rendering)
├── post-template.html (manual template)
├── post-example.txt (automated example)
└── YYYY/
    └── MM/
        └── your-post.html
```

## Scripts

- `create-blog-post.ps1` - Create post from text file
- `generate-blog-index.ps1` - Update latest-posts.json

## Categories

- **Technology** - Web dev, tools, productivity
- **Agentic AI** - AI systems, agents, MCP
- **Startups** - Entrepreneurship, fundraising
- **Career** - Professional development, leadership
