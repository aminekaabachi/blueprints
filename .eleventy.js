import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { RenderPlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

import markdownIt from "markdown-it"

const md = markdownIt({ html: true });

// Helper function to generate collapsable HTML
function generateCollapsableHTML(title, content, isOpen) {
  const expandedState = isOpen ? 'true' : 'false';
  const openClass = isOpen ? 'is-open' : '';
  const contentId = `collapsable-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;

  return `<div class="collapsable" data-collapsable>
<button 
  class="collapsable-header" 
  aria-expanded="${expandedState}"
  aria-controls="collapsable-content-${contentId}"
  data-collapsable-trigger
>
  <span class="collapsable-icon" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </span>
  <span class="collapsable-title">${title}</span>
</button>
<div 
  class="collapsable-content ${openClass}" 
  id="collapsable-content-${contentId}"
  data-collapsable-content
>
  <div class="collapsable-body">
    ${md.render(content)}
  </div>
</div>
</div>`;
}

// Helper function to generate Excalidraw HTML
function generateExcalidrawHTML(url, width, height, title) {
  return `<div class="excalidraw-container">
<a href="${url}" target="_blank" style="width: ${width};" class="excalidraw-link">
  <iframe 
    src="${url}" 
    width="${width}" 
    height="${height}" 
    style="border: none; pointer-events: none;" 
    title="${title}"
    loading="lazy"
    allowfullscreen>
  </iframe>
</a>
</div>
<div class="excalidraw-title">
<span>${title}</span>
</div>`;
}

export default function (eleventyConfig) {
  // ===== Plugins =====
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(RenderPlugin);
	eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  // ===== Shortcodes =====
  
  // Excalidraw diagram shortcode
  eleventyConfig.addShortcode("excalidraw", function (url, title = "Excalidraw Diagram", height = "400px", width = "100%") {
    return generateExcalidrawHTML(url, width, height, title);
  });

  // Simple collapsable shortcode
  eleventyConfig.addShortcode("collapsable", function (title, content, isOpen = false, id = "") {
    return generateCollapsableHTML(title, content, isOpen, id);
  });

  // Paired collapsable shortcode
  eleventyConfig.addPairedShortcode("collapsableBlock", function (content, title, isOpen = false, id = "") {
    return generateCollapsableHTML(title, content, isOpen, id);
  });

  // ===== Filters =====

  eleventyConfig.addFilter('markdownify', (str) => {
    return md.renderInline(str);
  });
  
  // Date formatting filter
  eleventyConfig.addFilter("dateformat", function (date, format) {
    const d = new Date(date);
    
    const formatMap = {
      'YYYY-MM-DD': () => d.toISOString().split('T')[0],
      'MMMM D, YYYY': () => d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      'MMM YYYY': () => d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      }),
      'D M YYYY': () => d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    return formatMap[format] ? formatMap[format]() : d.toLocaleDateString();
  });

  // Current year filter
  eleventyConfig.addFilter("year", function () {
    return new Date().getFullYear();
  });

  // Categories filter
  eleventyConfig.addFilter("getCategories", function (article) {
    const categories = new Set();
    for (const post of article) {
      if (post.data.category) {
        categories.add(post.data.category);
      }
    }
    return Array.from(categories).sort();
  });

  // ===== Static Asset Handling =====
  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/js');
  eleventyConfig.addPassthroughCopy({ "src/images/favicon": "/" });

  // ===== Configuration =====
  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
} 