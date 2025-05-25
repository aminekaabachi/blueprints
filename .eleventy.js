export default function(eleventyConfig) {
  // Add date filter
  eleventyConfig.addFilter("date", function(date, format) {
    const d = new Date(date);
    if (format === 'YYYY-MM-DD') {
      return d.toISOString().split('T')[0];
    }
    if (format === 'MMMM D, YYYY') {
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    if (format === 'MMM YYYY') {
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    }
    return d.toLocaleDateString();
  });

  // Add year filter
  eleventyConfig.addFilter("year", function() {
    return new Date().getFullYear();
  });

  // Add getCategories filter
  eleventyConfig.addFilter("getCategories", function(posts) {
    const categories = new Set();
    for (const post of posts) {
      if (post.data.category) {
        categories.add(post.data.category);
      }
    }
    return Array.from(categories).sort();
  });

  // Copy CSS files
  eleventyConfig.addPassthroughCopy('src/css');

  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
} 