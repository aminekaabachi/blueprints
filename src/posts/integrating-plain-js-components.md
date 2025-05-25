---
title: Integrating plain JS components
date: 2025-01-31
layout: layouts/article.njk
category: Lessons from a bad React codebase
tags: post
---

This post is part of a series called "Lessons from a bad React codebase". You can read more about this series [here](#).

Things were not off to a great start.

I had just cloned the project and I kept getting this cryptic error message when I tried to install the dependencies using `yarn`.

```bash
# This file contains the result of Yarn building a package (root-workspace-0b6124@workspace:.)
# Script name: postinstall

No matches found: "node_modules/@playkit-js/playkit-js-kava/src/*"
```

Running the project returned yet another cryptic error message.

```python
error - ./src/hooks/useKaltura.ts:18:27
Module not found: Can't resolve '@playkit-js/playkit-js-kava/src/kava'
> 18 |     const { Kava } = await import("@playkit-js/playkit-js-kava/src/kava");
     |                           ^

19 |     kalturaPlayer.registerPlugin("kava", Kava);
```

After a few hours of digging, I finally figured out what was going on. But we are just getting started with the problems in this codebase.

## The Problem

The issue was related to how the project was trying to import and use external JavaScript libraries that weren't properly configured for the build system.

### Understanding the Error

The error messages were indicating that:

1. **Build-time issue**: The postinstall script couldn't find the expected files
2. **Runtime issue**: The module resolution was failing for the Kaltura player plugin

### The Solution

Here's how we eventually resolved these issues:

```javascript
// Instead of dynamic imports with specific paths
const { Kava } = await import("@playkit-js/playkit-js-kava/src/kava");

// We used proper module resolution
import { Kava } from "@playkit-js/playkit-js-kava";
```

## Key Takeaways

- Always check package.json for proper dependency declarations
- Avoid hardcoded paths in dynamic imports
- Use proper module resolution patterns
- Test your build process thoroughly

## Interactive Example

Here's a working example of proper module resolution in a React component:

{% include "components/excalidraw.njk", url: "https://link.excalidraw.com/readonly/hyLEXamLPHX5PusstEYU", title: "Excalidraw Diagram" %}
  
You can also check out this helpful video explanation:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="JavaScript Module Resolution" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

This experience taught us valuable lessons about dependency management and module resolution in modern JavaScript projects. 