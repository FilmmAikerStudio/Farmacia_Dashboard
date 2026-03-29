#!/usr/bin/env bash
# ================================================================
# Farmacia Barcelona Dashboard — VPS Deploy Script
#
# Run this from YOUR LOCAL MACHINE (not from the dev server):
#   chmod +x deploy.sh && ./deploy.sh
#
# Requirements on your machine: ssh, scp (standard on Mac/Linux)
# ================================================================

set -e

VPS_HOST="76.13.42.106"
VPS_USER="root"
REMOTE_APP_DIR="/var/www/farmacia-dashboard"
LOCAL_BUILD_DIR="./dist"

echo "==> Building production bundle..."
npm run build

echo "==> Connecting to VPS and preparing directories..."
ssh "${VPS_USER}@${VPS_HOST}" "
  # Install nginx if not present
  which nginx || (apt-get update -qq && apt-get install -y nginx)

  # Create web root
  mkdir -p ${REMOTE_APP_DIR}

  # Copy .env.local if it doesn't exist on server (first deploy)
  # You need to create this manually or via scp below
"

echo "==> Uploading build artifacts..."
# Remove old build, upload fresh dist
ssh "${VPS_USER}@${VPS_HOST}" "rm -rf ${REMOTE_APP_DIR}/*"
scp -r "${LOCAL_BUILD_DIR}/." "${VPS_USER}@${VPS_HOST}:${REMOTE_APP_DIR}/"

echo "==> Configuring nginx..."
ssh "${VPS_USER}@${VPS_HOST}" "cat > /etc/nginx/sites-available/farmacia-dashboard << 'NGINX'
server {
    listen 80;
    server_name dashboard.farmaciaforbeauty.cloud;

    root ${REMOTE_APP_DIR};
    index index.html;

    # SPA routing — all paths serve index.html
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }

    # Security headers
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy strict-origin-when-cross-origin;
}
NGINX

# Enable site
ln -sf /etc/nginx/sites-available/farmacia-dashboard /etc/nginx/sites-enabled/farmacia-dashboard
# Remove default site if it exists
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t && systemctl reload nginx
echo '==> Nginx reloaded OK'
"

echo ""
echo "================================================================"
echo "  Deploy complete!"
echo "  Dashboard: http://dashboard.farmaciaforbeauty.cloud"
echo ""
echo "  IMPORTANT — first deploy only:"
echo "  Copy your .env.local to the VPS for credentials:"
echo "    scp .env.local root@${VPS_HOST}:${REMOTE_APP_DIR}/.env.local"
echo ""
echo "  To enable HTTPS (Let's Encrypt):"
echo "    ssh root@${VPS_HOST}"
echo "    apt-get install -y certbot python3-certbot-nginx"
echo "    certbot --nginx -d dashboard.farmaciaforbeauty.cloud"
echo "================================================================"
