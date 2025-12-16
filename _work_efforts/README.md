# Work Efforts System

This project uses the **Johnny Decimal** system for organizing and tracking work efforts.

## Structure

```
_work_efforts/
├── XX-XX_category_name/          # Main category (00-99)
│   └── XX_subcategory_name/      # Subcategory (00-99)
│       ├── XX.00_index.md        # Index file with links
│       ├── XX.01_document.md     # First work effort
│       └── XX.02_document.md     # Second work effort
└── README.md                     # This file
```

## Categories

### 00-09: Project Management
Meta tasks, organization, documentation, and project infrastructure.

- **00: Organization** - Project setup, structure, and organizational tasks

### 10-19: Development
Site development, features, and technical implementation.

- **10: Site Development** - Core site features, components, and functionality

## Using MCP Tools

This project integrates with MCP (Model Context Protocol) tools for managing work efforts:

- **List Work Efforts**: View all work efforts by status (active, paused, completed, all)
- **Search Work Efforts**: Search by keyword in title or content
- **Create Work Effort**: Create new work efforts with automatic Johnny Decimal numbering
- **Update Work Effort**: Update status or add progress notes

## Index Files

Each subcategory has an `XX.00_index.md` file that provides:
- Links to all documents in the subcategory
- Links to related documents in other subcategories
- Links to external references
- Brief descriptions of each document

## Current Work Efforts

As of December 16, 2025, the following work efforts are tracked:

### Active Work Efforts
- **00.01** - Project Setup and Organization
- **00.03** - Technical Debt Documentation Setup
- **10.01** - Component Library Enhancement PR

### Completed Work Efforts
- **00.02** - MCP Work Efforts System Setup

Use the MCP tools to list and search work efforts:

```bash
# List all work efforts
# Use MCP tool: list_work_efforts

# Search for specific work efforts
# Use MCP tool: search_work_efforts
```

## Documentation

- See `docs/README.md` for full project documentation
- See individual work effort files for detailed task tracking
- See index files in each subcategory for navigation
