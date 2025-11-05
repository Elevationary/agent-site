# Testing Strategy

## ✅ COMPLETED (2025-11-03) - Smoke Testing Framework

### Smoke Test Implementation
- **Script**: `smoke-test.sh` (executable via `npm run smoke-test`)
- **Coverage**: 12 comprehensive tests across all critical components
- **Validation**: JSON-LD structure, product data integrity, URL formats
- **Output**: Clean pass/fail results with color coding

### Test Categories
1. **JSON-LD Validation** (4 tests)
   - Presence of JSON-LD script tags
   - Valid JSON syntax
   - Required Product fields: `@context`, `@type`, `@id`, `name`, `description`, `brand`, `image`, `offers`
   - Required Offer fields: `@type`, `@id`, `url`, `priceCurrency`, `price`, `priceValidUntil`, `availability`, `seller`

2. **Product Data Validation** (6 tests)
   - Products.json structure validation
   - Required keys presence: `key`, `slug`, `title`, `description`, `price`, `currency`, `og_image`, `indexable`, `booking_url`, `pay_url`, `lastmod`
   - Data type validation (prices as numbers)
   - URL format validation (HTTPS protocol)

3. **URL Validation** (2 tests)
   - Booking URLs format validation
   - Payment URLs format validation

### Technical Implementation
- **Tools**: `bash`, `jq`, `grep`, `sed`
- **Special Handling**: Proper `jq` syntax for fields with `@` symbols
- **Error Suppression**: Clean output without debug noise
- **Exit Codes**: 0 for success, 1 for failure

## 404 & Redirects Testing

### 404 Page Validation
- **Content**: Verify all 4 consultation options are displayed with correct titles
- **Links**: Test all consultation links resolve to correct pages
- **Branding**: Ensure titles match products.json for consistency

### Redirects Sanity
- **Legacy cleanup**: Confirm no `/p/` redirect rules exist
- **Clean URLs**: Verify `/consulting-*/` structure works without additional redirects
- **Decision**: Skipped optional `_redirects` file (unnecessary complexity)

### Verification Commands
```bash
# Test 404 page content
curl -sL https://agent.elevationary.com/nonexistent-page | grep -E 'consulting-15|consulting-30|consulting-60|consulting-90'

# Verify clean URLs work
curl -I https://agent.elevationary.com/consulting-60/ | head -1
```

## Homepage Optimization

### SEO/Crawler Validation
- **Purpose**: Homepage serves search engines and automated agents, not human users
- **Content**: Minimal UI with JSON-LD structured data for SEO, AEO, and ACP
- **Navigation**: 404 page handles user navigation, homepage handles crawlers

### Technical Architecture
- **Static homepage**: `/index.html` serves production traffic (simple, reliable)
- **Dynamic templates**: `/src/index.html` → `_site/index.html` for build process
- **Clean separation**: Static root files + dynamic `_site/` directory

### Verification Commands
```bash
# Test homepage has minimal UI
curl -sL https://agent.elevationary.com/ | grep -c "<div class=\"card\">"
# Should return 0 (no product cards)

# Verify JSON-LD structured data present
curl -sL https://agent.elevationary.com/ | grep -c "application/ld+json"
# Should return 2 (Organization + ItemList)

# Test explanatory text present
curl -sL https://agent.elevationary.com/ | grep "Machine-readable listing"
# Should return the explanatory text for accidental visitors
```

### Content Polish Verification
```bash
# Test consultation pages have above-the-fold summaries
curl -sL https://www.elevationary.com/consulting/15-minute-ai-strategy-introductory-consultation | grep -c "Who It's For"
# Should return 2 (above-fold + full description)

# Verify standardized structure across all consultations
for page in 15-minute-ai-strategy-introductory-consultation 30-minute-ai-readiness-consultation 60-minute-ai-strategy-consultation 90-minute-ai-strategy-in-depth-consultation; do
  echo "Checking $page..."
  curl -sL "https://www.elevationary.com/consulting/$page" | grep -E "(Who It's For|Key Benefits|What You Get|Session Expectations)" | wc -l
  # Should return 8 for each page (4 sections × 2 placements)
done

# Test inclusive language usage
curl -sL https://www.elevationary.com/consulting/15-minute-ai-strategy-introductory-consultation | grep -c "organization"
# Should return > 0 (inclusive language present)

# Verify dual CTA placement
curl -sL https://www.elevationary.com/consulting/60-minute-ai-strategy-consultation | grep -c "Schedule Your Consultation"
# Should return 2 (top + bottom CTA)
```

## 1. Cross-Browser Testing

### Supported Browsers
- **Desktop**: Latest versions of Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome for Android
- **AI Browsers**: Comet, other AI-powered browsers

### Testing Tools
- **BrowserStack** for cross-browser testing
- **Lighthouse** for performance, accessibility, and PWA testing
- **WebPageTest** for performance benchmarking

## 2. Automated Testing

### Unit Testing
- **Framework**: Jest
- **Coverage**: 80%+ for critical paths
- **Focus**: Utility functions, form validation, data transformations

### Integration Testing
- **Framework**: Cypress
- **Test Cases**:
  - User flows (booking, subscription)
  - Form submissions
  - API interactions

### End-to-End Testing
- **Framework**: Playwright
- **Scenarios**:
  - Complete user journey
  - Payment processing
  - Error handling

## 3. Performance Testing

### Tools
- **Lighthouse CI** for performance budgets
- **k6** for load testing
- **Web Vitals** for RUM

### Key Metrics
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **TTI**: < 3.5s

## 4. Security Testing

### Automated Scans
- **OWASP ZAP** for vulnerabilities
- **Snyk** for dependencies
- **CSP** validation

### Manual Testing
- Authentication flows
- Data validation
- Session management

## 5. AI Browser Compatibility

### Testing Approach
- Manual testing on AI browsers
- Content parsing verification
- Structured data validation

## 6. Test Environment

### Setup
- Staging environment
- CI/CD integration
- Monitoring dashboards

## 7. Test Data Management

### Strategy
- Factory functions
- Isolated test DBs
- Data anonymization

## 8. Test Reporting

### Deliverables
- Visual regression tests
- Test run recordings
- Detailed reports

## 9. Accessibility Testing

### Standards
- WCAG 2.1 AA compliance
- Screen reader testing
- Keyboard navigation

## 10. Continuous Improvement

### Process
- Regular test reviews
- Performance tracking
- Coverage analysis
- Production monitoring