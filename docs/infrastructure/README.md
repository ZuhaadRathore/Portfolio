# Infrastructure Documentation

This directory contains comprehensive infrastructure diagrams and documentation for the Portfolio Website application.

## Available Documentation

### [INFRASTRUCTURE.md](./INFRASTRUCTURE.md)
Complete infrastructure documentation for the Portfolio Website, including:

1. **System Architecture Overview**
   - High-level system design
   - Hosting and CDN architecture
   - External service integrations

2. **Frontend Architecture**
   - Component structure and hierarchy
   - State management and data flow
   - Styling and theming system

3. **Build & Deployment Pipeline**
   - GitHub Actions CI/CD workflow
   - Deployment targets (Vercel, GitHub Pages)
   - Build optimization and caching

4. **External Integrations**
   - GitHub GraphQL API integration
   - Google Fonts CDN
   - Devicons CDN
   - Authentication and rate limiting

5. **Development Environment**
   - Local development setup
   - Development tools and workflow
   - Configuration files

6. **Technology Stack**
   - Complete dependency list
   - Version information
   - Service endpoints

## Visual Diagrams

All diagrams are rendered using Mermaid syntax and can be viewed directly in GitHub or any Mermaid-compatible markdown viewer.

### Diagram Types

- **System Architecture**: Overall application structure
- **Frontend Architecture**: Component tree and data flow
- **Build Pipeline**: CI/CD workflow from commit to deployment
- **External Integrations**: Third-party services and APIs
- **Development Environment**: Local development setup

## Quick Links

- [Main README](../../README.md)
- [GitHub Actions Workflow](../../.github/workflows/nextjs.yml)
- [Next.js Configuration](../../next.config.js)
- [Tailwind Configuration](../../tailwind.config.ts)

## How to Use

1. **For Developers**: Review the infrastructure documentation to understand the application architecture before contributing
2. **For DevOps**: Use the CI/CD pipeline diagram to understand deployment process
3. **For Onboarding**: Start with System Architecture Overview to get familiar with the stack

## Viewing Diagrams

**GitHub**: Diagrams render automatically when viewing markdown files

**VS Code**: Install the "Markdown Preview Mermaid Support" extension

**Other Editors**: Use any Mermaid-compatible markdown preview tool

## Contributing

When updating infrastructure:
1. Update the relevant diagrams in INFRASTRUCTURE.md
2. Document changes in commit messages
3. Update version information if applicable

---

**Last Updated**: 2025-11-14
**Maintained By**: Zuhaad Rathore
