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

// Helper function to generate YouTube video HTML
function generateYouTubeHTML(videoId, width, height, title) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  return `<div class="youtube-container">
<iframe 
  src="${embedUrl}" 
  width="${width}" 
  height="${height}" 
  style="border: none;" 
  title="${title}"
  loading="lazy"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
</div>
${title ? `<div class="youtube-title"><span>${title}</span></div>` : ''}`;
}

// Helper function to generate GitHub Gist HTML
function generateGistHTML(gistId, width, height, title) {
  const gistUrl = `https://gist.github.com/${gistId}.js`;
  return `<div class="gist-container">
<script src="${gistUrl}"></script>
</div>
${title ? `<div class="gist-title"><span>${title}</span></div>` : ''}`;
}

// Helper function to generate Callout HTML
function generateCalloutHTML(type, content, icon) {
  const iconMap = {
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    tip: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="2"/></svg>`,
    note: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`
  };

  const selectedIcon = icon || iconMap[type] || iconMap.info;
  
  return `<div class="callout callout-${type}">
<div class="callout-icon">${selectedIcon}</div>
<div class="callout-content">
${md.render(content)}
</div>
</div>`;
}

export default function (eleventyConfig) {

  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if(data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

  // ===== Plugins =====
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(RenderPlugin);
	eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  // ===== Shortcodes =====
  
  // Excalidraw diagram shortcode
  eleventyConfig.addShortcode("excalidraw", function (url, title = "Excalidraw Diagram", height = "400px", width = "100%") {
    return generateExcalidrawHTML(url, width, height, title);
  });

  // Callout shortcode
  eleventyConfig.addShortcode("callout", function (type = "info", content) {
    return generateCalloutHTML(type, content);
  });

  // Paired callout shortcode
  eleventyConfig.addPairedShortcode("calloutBlock", function (content, type = "info") {
    return generateCalloutHTML(type, content);
  });

  // YouTube video shortcode
  eleventyConfig.addShortcode("youtube", function (videoId, title = "", height = "400px", width = "100%") {
    return generateYouTubeHTML(videoId, width, height, title);
  });

  // GitHub Gist shortcode
  eleventyConfig.addShortcode("gist", function (gistId, title = "", height = "400px", width = "100%") {
    return generateGistHTML(gistId, width, height, title);
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
  eleventyConfig.addPassthroughCopy('src/images/logo.svg');
  eleventyConfig.addPassthroughCopy({ "src/images/favicon": "/" });

  // ===== Configuration =====
  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
} 