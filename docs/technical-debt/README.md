# Technical Debt Documentation

This folder tracks technical debt items for the Chico Fab Lab website. Each document describes an area that needs improvement, the current state, proposed solutions, and priority level.

## Purpose

Technical debt accumulates naturally as projects evolve. Documenting it helps us:
- **Prioritize** improvements based on impact
- **Plan** refactoring work into sprints
- **Onboard** new contributors with context
- **Track** progress over time

## Current Debt Items

| Item | Priority | Effort | Impact |
|------|----------|--------|--------|
| [CSS Modularization](./css-modularization.md) | High | Large | Performance, Maintainability |
| [JavaScript Extraction](./javascript-extraction.md) | High | Large | Maintainability, Testing |
| [Font Loading Optimization](./font-loading.md) | Medium | Small | Performance |

## Priority Levels

- **Critical**: Blocking issues or security concerns
- **High**: Significant impact on maintainability or performance
- **Medium**: Would improve developer experience
- **Low**: Nice to have, can be addressed opportunistically

## Effort Estimates

- **Small**: < 2 hours
- **Medium**: 2-8 hours
- **Large**: 1-3 days
- **XL**: 1+ week

## How to Use This Documentation

### Adding New Debt Items

1. Create a new markdown file in this folder
2. Use the template below
3. Update the table in this README
4. Consider creating a work effort in `_work_efforts/`

### Template

```markdown
# [Title]

## Current State
Describe what exists today and why it's problematic.

## Impact
- Performance: [Low/Medium/High]
- Maintainability: [Low/Medium/High]
- Developer Experience: [Low/Medium/High]

## Proposed Solution
Outline the approach to address this debt.

## Tasks
- [ ] Task 1
- [ ] Task 2

## Estimated Effort
[Small/Medium/Large/XL]

## Dependencies
List any blockers or related items.

## References
- Links to relevant files
- Related issues or discussions
```

### Resolving Debt Items

When a debt item is fully resolved:
1. Move the file to `./resolved/` subfolder
2. Add resolution date and notes
3. Update the README table

## Related Resources

- [Component Showcase](/wiki/component-showcase.html) - Live UI examples
- [CSS Library](/wiki/css-library.html) - Utility documentation
- [Work Efforts](/_work_efforts/README.md) - Task tracking system



