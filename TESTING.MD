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