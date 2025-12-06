# Infrastructure Documentation

> **Note**: System architecture diagrams are currently being redesigned from scratch.
> Placeholder diagrams are in place while new architectural visualizations are being developed.

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

> **Status**: Architecture diagrams are being redesigned. Current diagrams use Mermaid syntax and can be viewed in GitHub.
> New diagrams will be custom SVG visualizations tailored to each project's architecture.

### Planned Diagram Types

- **System Architecture**: Overall application structure (to be redesigned)
- **Frontend Architecture**: Component tree and data flow (to be redesigned)
- **Build Pipeline**: CI/CD workflow from commit to deployment (to be redesigned)
- **External Integrations**: Third-party services and APIs (to be redesigned)
- **Development Environment**: Local development setup (to be redesigned)

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
