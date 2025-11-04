#!/bin/bash

# Smoke test script for Elevationary agent-site
# Validates JSON-LD structure and required product keys

echo "🔍 Running smoke tests..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -n "Testing $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        echo -e "  ${RED}Command: $test_command${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Function to validate JSON-LD in generated files
validate_jsonld() {
    local file="$1"
    
    # Check if JSON-LD script tag exists
    if ! grep -q "application/ld+json" "$file"; then
        echo "No JSON-LD script tag found in $file"
        return 1
    fi
    
    # Extract JSON-LD content
    local jsonld_content=$(sed -n '/<script type="application\/ld+json">/,/<\/script>/p' "$file" | sed '1d;$d' | sed 's/^[[:space:]]*//')
    
    # Validate JSON syntax
    if ! echo "$jsonld_content" | jq . > /dev/null 2>&1; then
        echo "Invalid JSON-LD syntax in $file"
        return 1
    fi
    
    # Check required fields
    local required_fields=("@context" "@type" "@id" "name" "description" "brand" "image" "offers")
    for field in "${required_fields[@]}"; do
        if [[ "$field" == @* ]]; then
            # Special handling for fields with @ symbol
            if ! echo "$jsonld_content" | jq -e '."'$field'"' > /dev/null 2>&1; then
                echo "Missing required field '$field' in $file"
                return 1
            fi
        elif ! echo "$jsonld_content" | jq -e ".$field" > /dev/null 2>&1; then
            echo "Missing required field '$field' in $file"
            return 1
        fi
    done
    
    # Check offer fields
    local offer_fields=("@type" "@id" "url" "priceCurrency" "price" "priceValidUntil" "availability" "seller")
    for field in "${offer_fields[@]}"; do
        if [[ "$field" == @* ]]; then
            # Special handling for offer fields with @ symbol
            if ! echo "$jsonld_content" | jq -e '.offers."'$field'"' > /dev/null 2>&1; then
                echo "Missing required offer field '$field' in $file"
                return 1
            fi
        elif ! echo "$jsonld_content" | jq -e ".offers.$field" > /dev/null 2>&1; then
            echo "Missing required offer field '$field' in $file"
            return 1
        fi
    done
    
    return 0
}

# Function to validate product data
validate_products_json() {
    local required_keys=("key" "slug" "title" "description" "price" "currency" "og_image" "indexable" "booking_url" "pay_url" "lastmod")
    
    # Check if products.json exists and is valid JSON
    if ! jq empty src/_data/products.json 2>/dev/null; then
        echo "products.json is not valid JSON"
        return 1
    fi
    
    # Check each product has required keys
    local product_count=$(jq length src/_data/products.json)
    for ((i=0; i<product_count; i++)); do
        for key in "${required_keys[@]}"; do
            if ! jq -e ".[$i].$key" src/_data/products.json > /dev/null 2>&1; then
                echo "Product at index $i missing required key '$key'"
                return 1
            fi
        done
    done
    
    # Check for empty/null values in required fields
    local empty_values=$(jq -r '.[] | to_entries[] | select(.key as $k | $k | IN("content") | not) | select(.value == null or .value == "") | "Product: \(.key | if type == "string" then . else "index \($k)" end) - Field: \(.key)"' src/_data/products.json)
    if [[ -n "$empty_values" ]]; then
        echo "Empty/null values found: $empty_values"
        return 1
    fi
    
    return 0
}

echo -e "\n${YELLOW}📋 JSON-LD Validation${NC}"

# Test JSON-LD in generated product pages
if [[ -d "_site/consulting-15" ]]; then
    for product_dir in _site/consulting-*/; do
        if [[ -d "$product_dir" ]]; then
            product_file="${product_dir}index.html"
            if [[ -f "$product_file" ]]; then
                echo -n "Testing JSON-LD in $(basename "$product_dir")... "
                if validate_jsonld "$product_file"; then
                    echo -e "${GREEN}✓ PASS${NC}"
                    ((TESTS_PASSED++))
                else
                    echo -e "${RED}✗ FAIL${NC}"
                    ((TESTS_FAILED++))
                fi
            fi
        fi
    done
else
    echo -e "${YELLOW}⚠ Product directories not found - make sure site is built${NC}"
fi

echo -e "\n${YELLOW}📦 Product Data Validation${NC}"

# Test products.json structure
run_test "products.json structure" "validate_products_json"

# Test specific required keys using grep/jq
run_test "All products have title" "jq -e '.[].title' src/_data/products.json"
run_test "All products have price" "jq -e '.[].price' src/_data/products.json"
run_test "All products have booking_url" "jq -e '.[].booking_url' src/_data/products.json"
run_test "All products have pay_url" "jq -e '.[].pay_url' src/_data/products.json"
run_test "All prices are numbers" "jq -e '.[] | (.price | type) == \"number\"' src/_data/products.json"

echo -e "\n${YELLOW}🔗 URL Validation${NC}"

# Test booking/pay URLs are valid URLs
run_test "Booking URLs are valid" "jq -e '.[].booking_url | test(\"^https?://\")' src/_data/products.json"
run_test "Pay URLs are valid" "jq -e '.[].pay_url | test(\"^https?://\")' src/_data/products.json"

echo -e "\n${YELLOW}📊 Test Summary${NC}"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [[ $TESTS_FAILED -eq 0 ]]; then
    echo -e "\n${GREEN}🎉 All smoke tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ $TESTS_FAILED smoke test(s) failed${NC}"
    exit 1
fi