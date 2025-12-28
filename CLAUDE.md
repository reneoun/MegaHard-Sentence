# Claude Code Project Configuration

## Project Overview
Open text editor with Microsoft Word-level functionality but superior UI/UX/DX. Built with TypeScript, Vite, and markdown parsing. Goal is to replace OOXML/DOCX complexity with simple Markdown + HTML hybrid.

## Development Approach
- **Build Command**: `bun run build`
- **Dev Command**: `bun run dev`
- **Test Command**: (none defined yet)
- **Lint Command**: (none defined yet)

## AI Session Documentation
- Create reports in `AI-Reports/` directory after each development session
- Format: `YYYY-MM-DD_HH-MM-SS_topic-name.md`
- Include: summary, changes made, files modified, next steps
- Keep reports concise and focused on what was accomplished

## Code Style
- TypeScript with modern ES modules
- Minimal dependencies (currently: marked, vite)
- Clean, readable code without unnecessary complexity
- Follow existing patterns in main.ts

## Current Features
- Multi-page text editing (Cmd+Enter for new page)
- Page navigation with arrow keys
- Page deletion with Backspace on empty pages
- Basic A4-style layout

## Next Priority Features
1. Enhanced markdown preview integration
2. Rich text formatting (bold, italic, lists)
3. Save/load functionality
4. Export capabilities (HTML, PDF)
5. Performance optimizations for large documents