const { DateTime } = require('luxon');
const path = require('path');

module.exports = function(eleventyConfig) {
  // Configure Nunjucks environment with custom filters
  const Nunjucks = require('nunjucks');
  const nunjucksEnvironment = new Nunjucks.Environment(
    new Nunjucks.FileSystemLoader([
      path.join(__dirname, 'src/_includes'),
      path.join(__dirname, 'src')
    ])
  );
  
  // Add date filter that handles both string and Date objects
  nunjucksEnvironment.addFilter('date', function(dateObj, format) {
    if (!dateObj) return '';
    format = format || 'yyyy-MM-dd';
    const date = typeof dateObj === 'string' 
      ? new Date(dateObj) 
      : dateObj;
    return DateTime.fromJSDate(date, {zone: 'utc'}).toFormat(format);
  });
  
  // Add number format filter for currency
  nunjucksEnvironment.addFilter('numberFormat', function(number, format) {
    format = format || '0.00';
    const num = parseFloat(number);
    if (isNaN(num)) return number;
    
    if (format === '0.00') {
      return num.toFixed(2);
    }
    return num.toString();
  });
  
  eleventyConfig.setLibrary('njk', nunjucksEnvironment);

  // Static passthroughs to the build output root
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("_headers");
  eleventyConfig.addPassthroughCopy("404.html");
  eleventyConfig.addPassthroughCopy("google*.html");
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "src/.well-known": ".well-known" });

  return {
    dir: { 
      input: "src", 
      output: "_site", 
      includes: "_includes", 
      data: "_data" 
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"]
  };
};
