#!/bin/bash
# SEO Validation Script
# Run this script before pushing changes to validate SEO elements

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Starting SEO validation...${NC}"

# Configuration
BASE_URL="http://localhost:8080"  # Update this if your local dev server runs on a different port
PAGES=(
  "/"
  "/consulting-60/"
  "/consulting-30/"
  "/consulting-90/"
)

# Check if local server is running
check_server_running() {
  if ! curl -s -o /dev/null -I -w "%{http_code}" "$BASE_URL" | grep -q "200\|301\|302"; then
    echo -e "${YELLOW}⚠️  Local server not running at $BASE_URL${NC}"
    echo -e "${BLUE}Please start your local development server first:${NC}"
    echo -e "  npm run dev  # or whatever command starts your server"
    echo -e "${BLUE}Then run this script again.${NC}"
    exit 1
  fi
  return 0
}

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if required commands are installed
for cmd in curl jq; do
  if ! command -v $cmd &> /dev/null; then
    echo -e "${RED}❌ Error: $cmd is required but not installed.${NC}"
    echo "  - On macOS, install with: brew install $cmd"
    echo "  - On Ubuntu/Debian: sudo apt-get install $cmd"
    exit 1
  fi
done

# Function to check URL
check_url() {
  local url="$1"
  local full_url="${BASE_URL}${url}"
  echo -e "\n${GREEN}🔗 Checking $full_url${NC}"
  
  # Check if URL is accessible
  status_code=$(curl -s -o /dev/null -w "%{http_code}" -I "$full_url")
  if [ "$status_code" != "200" ]; then
    echo -e "${RED}❌ Error: $url returned HTTP $status_code${NC}"
    return 1
  fi
  
  # Get page content
  content=$(curl -s "$full_url")
  
  # Check title
  if ! echo "$content" | grep -q '<title>'; then
    echo -e "${RED}❌ Missing <title> tag${NC}"
  else
    title=$(echo "$content" | grep -o '<title>.*</title>' | sed 's/<[^>]*>//g')
    echo -e "${GREEN}✓ Title: $title${NC}"
    
    # Check title length
    if [ ${#title} -gt 60 ]; then
      echo -e "${YELLOW}⚠️  Title is too long (${#title}/60 chars)${NC}"
    fi
  fi
  
  # Check description
  if ! echo "$content" | grep -q '<meta name="description"'; then
    echo -e "${RED}❌ Missing meta description${NC}"
  else
    desc=$(echo "$content" | grep -o '<meta name="description" content="[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}✓ Description: ${desc:0:60}...${NC}"
    
    # Check description length
    if [ ${#desc} -gt 160 ]; then
      echo -e "${YELLOW}⚠️  Description is too long (${#desc}/160 chars)${NC}"
    fi
  fi
  
  # Check canonical
  if ! echo "$content" | grep -q '<link rel="canonical"'; then
    echo -e "${YELLOW}⚠️  No canonical URL specified${NC}"
  else
    canonical=$(echo "$content" | grep -o '<link rel="canonical" href="[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}✓ Canonical: $canonical${NC}"
  fi
  
  # Check Open Graph tags
  echo -e "\n${GREEN}🔍 Checking Open Graph tags:${NC}"
  for tag in og:title og:description og:image og:url; do
    if ! echo "$content" | grep -q "property=\"$tag\""; then
      echo -e "${YELLOW}⚠️  Missing Open Graph $tag${NC}"
    else
      value=$(echo "$content" | grep -o "property=\"$tag\" content=\"[^\"]*" | cut -d'"' -f4)
      echo -e "${GREEN}✓ $tag: ${value:0:60}${value:60:+...}${NC}"
    fi
  done
  
  # Check JSON-LD
  if ! echo "$content" | grep -q '<script type="application/ld+json"'; then
    echo -e "${YELLOW}⚠️  No JSON-LD structured data found${NC}"
  else
    echo -e "${GREEN}✓ JSON-LD structured data found${NC}"
  fi
  
  echo -e "${GREEN}✅ Basic SEO checks passed for $url${NC}"
}

# Check sitemap.xml
echo -e "\n${BLUE}🌐 Checking sitemap.xml...${NC}"
if ! curl -s -f "${BASE_URL}/sitemap.xml" | grep -q 'xmlns='; then
  echo -e "${YELLOW}⚠️  sitemap.xml not found or invalid at ${BASE_URL}/sitemap.xml${NC}"
  echo -e "${BLUE}To generate a sitemap, you can add a sitemap plugin to your build process.${NC}"
  echo -e "${BLUE}For Eleventy, consider using @quasibit/eleventy-plugin-sitemap${NC}"
  echo -e "${BLUE}Would you like to continue with other checks? [y/N]${NC}"
  read -r CONTINUE
  if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
    exit 1
  fi
else
  echo -e "${GREEN}✓ Valid sitemap.xml found${NC}"
fi

# Check robots.txt
echo -e "\n${GREEN}🤖 Checking robots.txt...${NC}"
robots_content=$(curl -s "${BASE_URL}/robots.txt")
if ! echo "$robots_content" | grep -q 'Sitemap:'; then
  echo -e "${YELLOW}⚠️  robots.txt is missing sitemap directive${NC}
"
else
  echo -e "${GREEN}✓ robots.txt contains sitemap directive${NC}"
  
  # Check for disallowed directories
  for dir in /admin/ /private/ /staging/; do
    if ! echo "$robots_content" | grep -q "Disallow: $dir"; then
      echo -e "${YELLOW}⚠️  Consider adding 'Disallow: $dir' to robots.txt for security${NC}"
    fi
  done
fi

# Check all pages
echo -e "\n${BLUE}🔍 Checking individual pages...${NC}"
for page in "${PAGES[@]}"; do
  if check_server_running; then
    check_url "$page"
  fi
done

echo -e "\n${GREEN}🎉 SEO validation complete!${NC}"
echo -e "\n${GREEN}Next steps:${NC}"
echo "1. Review any warnings or errors above"
echo "2. Check Google Search Console for additional insights"
echo "3. Run this script again after making changes"

# Make the script executable
echo -e "\n${GREEN}Making script executable...${NC}"
chmod +x "$0"

exit 0