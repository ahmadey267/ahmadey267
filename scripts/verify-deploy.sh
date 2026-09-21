#!/usr/bin/env bash
# Verify a deployed Haviy Global Services build.
#   ./scripts/verify-deploy.sh                  # checks www.hgs.co.ke
#   ./scripts/verify-deploy.sh hgs.pages.dev    # checks any other host
set -uo pipefail

HOST="${1:-www.hgs.co.ke}"
S="https://${HOST}"
pass=0; fail=0

ok()   { printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass+1)); }
bad()  { printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail+1)); }
note() { printf '        %s\n' "$1"; }

echo
echo "Verifying ${S}"
echo

# --- Is it actually our site, or an interstitial? ------------------------
echo "Identity"
headers="$(curl -sSI --max-time 20 "$S/" 2>/dev/null)"
if [ -z "$headers" ]; then
  bad "no response at all — DNS not resolved yet, or the host is unreachable"
  echo; echo "Stopping: nothing is answering on ${HOST}."; exit 1
fi

status="$(printf '%s' "$headers" | awk 'NR==1{print $2}')"
server="$(printf '%s' "$headers" | grep -i '^server:' | tr -d '\r' | cut -d' ' -f2-)"
location="$(printf '%s' "$headers" | grep -i '^location:' | tr -d '\r' | cut -d' ' -f2-)"

note "HTTP ${status:-?} from server '${server:-none}'"

[ "$server" = "cloudflare" ] && ok "served by Cloudflare" \
  || bad "server header is '${server:-none}', not cloudflare — something is intercepting"

if printf '%s' "$location" | grep -qi 'cloudflareaccess.com'; then
  bad "Cloudflare Access is protecting this project — visitors hit a login wall"
  note "turn it off: Pages project > Settings > Access policy"
fi

body_hits="$(curl -sS --max-time 20 "$S/" 2>/dev/null | grep -c 'Haviy Global Services')"
if [ "$body_hits" -gt 0 ]; then
  ok "page body is the real site (${body_hits} brand matches)"
else
  bad "page body is NOT the site — you are receiving an interstitial or error page"
  echo
  echo "-----------------------------------------"
  echo "  Stopping here. Every check below would fail for the same reason,"
  echo "  which would bury the real diagnosis. Fix what is answering on"
  echo "  ${HOST} first, then run this again."
  echo
  echo "  Most likely, in order:"
  echo "    1. DNS has not finished propagating to Cloudflare yet"
  echo "    2. Cloudflare Access is protecting the Pages project"
  echo "    3. your own network is intercepting the request (try mobile data)"
  echo
  exit 1
fi

# --- Routes -------------------------------------------------------------
echo
echo "Routes"
for p in / /about.html /services.html /contact.html /robots.txt /sitemap.xml /assets/img/hero.jpg; do
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$S$p" 2>/dev/null)"
  [ "$code" = "200" ] && ok "$p -> 200" || bad "$p -> $code (expected 200)"
done
code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$S/no-such-page" 2>/dev/null)"
[ "$code" = "404" ] && ok "/no-such-page -> 404 (404.html is wired up)" \
  || bad "/no-such-page -> $code (expected 404; Pages did not pick up 404.html)"

# --- Headers from _headers ---------------------------------------------
echo
echo "Security headers"
for h in x-content-type-options referrer-policy permissions-policy x-frame-options; do
  if printf '%s' "$headers" | grep -qi "^$h:"; then
    ok "$h present"
  else
    bad "$h missing — _headers is not being applied"
  fi
done

echo
echo "Cache windows"
img_cc="$(curl -sSI --max-time 20 "$S/assets/img/hero.jpg" 2>/dev/null | grep -i '^cache-control:' | tr -d '\r' | cut -d' ' -f2-)"
css_cc="$(curl -sSI --max-time 20 "$S/assets/css/styles.css" 2>/dev/null | grep -i '^cache-control:' | tr -d '\r' | cut -d' ' -f2-)"
printf '%s' "$img_cc" | grep -q '2592000' && ok "image cached 30 days" || bad "image cache-control is '${img_cc:-none}' (expected max-age=2592000)"
printf '%s' "$css_cc" | grep -q '3600'    && ok "stylesheet cached 1 hour" || bad "stylesheet cache-control is '${css_cc:-none}' (expected max-age=3600)"

# --- Social preview -----------------------------------------------------
echo
echo "Social preview"
og="$(curl -sS --max-time 20 "$S/" 2>/dev/null | grep -o 'property="og:image" content="[^"]*"' | cut -d'"' -f4)"
if [ -n "$og" ]; then
  note "og:image = $og"
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$og" 2>/dev/null)"
  [ "$code" = "200" ] && ok "og:image resolves (WhatsApp and LinkedIn previews will render)" \
    || bad "og:image returns $code — shared links will show no preview image"
else
  bad "no og:image tag found"
fi

echo
echo "-----------------------------------------"
printf '  %d passed, %d failed\n' "$pass" "$fail"
echo
[ "$fail" -eq 0 ] || exit 1
