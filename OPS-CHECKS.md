# Ops Checks (quick copy/paste)

## DNS & Proxies
dig +short elevationary.com
dig +short www.elevationary.com
dig +short agent.elevationary.com CNAME

## Redirects (.ai → main site)
curl -I "https://elevationary.ai/foo?x=1" | sed -n '1,5p'
curl -I "https://www.elevationary.ai/abc?y=2" | sed -n '1,5p'
curl -I "https://blog.elevationary.ai/test" | sed -n '1,5p'

## TLS / HSTS
curl -sI "https://elevationary.com" | grep -i strict-transport-security
curl -sI "https://www.elevationary.com" | grep -i strict-transport-security
curl -sI "https://agent.elevationary.com" | grep -i strict-transport-security

# Certificate SANs (expect apex + wildcard)
openssl s_client -connect www.elevationary.com:443 -servername www.elevationary.com 2>/dev/null \
| openssl x509 -noout -text | sed -n '/Subject:/p;/X509v3 Subject Alternative Name/,+1p'
openssl s_client -connect elevationary.com:443 -servername elevationary.com 2>/dev/null \
| openssl x509 -noout -text | sed -n '/Subject:/p;/X509v3 Subject Alternative Name/,+1p'

## Headers & Caching
curl -sI "https://agent.elevationary.com/consulting-60/" | grep -i 'content-type\|cache-control\|strict-transport-security\|x-content-type-options'
curl -sI "https://agent.elevationary.com/assets/elevationary-logo-512.png" | grep -i cache-control

## Robots / Sitemap
curl -sI "https://agent.elevationary.com/robots.txt"  | sed -n '1,5p'
curl -sI "https://agent.elevationary.com/sitemap.xml" | sed -n '1,5p'

## Canonical & OG on product page
curl -sL "https://agent.elevationary.com/consulting-60/" | grep -i '<link rel="canonical"\|og:image'

## Email auth (spot check)
dig +short TXT elevationary.com
dig +short TXT _dmarc.elevationary.com
dig +short TXT google._domainkey.elevationary.com

dig +short MX elevationary.ai
dig +short TXT elevationary.ai
dig +short TXT _dmarc.elevationary.ai
dig +short TXT cf2024-1._domainkey.elevationary.ai



## CSS + 404 quick checks
curl -sI https://agent.elevationary.com/assets/styles.css | grep -i cache-control
# Expect: max-age=31536000, immutable

curl -I https://agent.elevationary.com/this/does/not/exist | head -1
# Expect: HTTP/2 404
