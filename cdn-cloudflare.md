# Configuration Cloudflare pour CODE AXIS
# Documentation pour configurer Cloudflare CDN

# 1. Créer un compte Cloudflare
#    - Allez sur https://cloudflare.com
#    - Créez un compte gratuit

# 2. Ajouter votre domaine
#    - Allez dans "Add a Site"
#    - Entrez "codeaxis.cm" (ou votre domaine personnalisé)
#    - Sélectionnez le plan Free

# 3. Configurer les DNS
#    Cloudflare vous donnera 2 nameservers à configurer chez votre registrar :
#    - Exemple : alice.ns.cloudflare.com
#    - Exemple : bob.ns.cloudflare.com

# 4. Activer le CDN
#    - Dans le dashboard Cloudflare, allez dans "DNS"
#    - Activez le proxy (nuage orange) pour votre domaine
#    - Cloudflare proxy automatiquement le trafic

# 5. Configurer les paramètres de performance
#    - Allez dans "Speed" > "Optimization"
#    - Activez "Auto Minify" pour HTML, CSS, JS
#    - Activez "Brotli" pour la compression
#    - Activez "HTTP/2" et "HTTP/3"
#    - Activez "Rocket Loader" (attention : peut casser certains scripts)

# 6. Configurer le cache
#    - Allez dans "Caching" > "Configuration"
#    - Activez "Cache Level: Standard"
#    - Configurez les règles de cache :
#      - /assets/* : Cache Everything, Edge TTL 1 month
#      - /*.html : Cache Everything, Edge TTL 1 hour
#      - /api/* : Bypass Cache

# 7. Configurer la sécurité
#    - Allez dans "Security" > "Settings"
#    - Activez "Under Attack Mode" si nécessaire
#    - Configurez le "Security Level" (Medium par défaut)
#    - Activez "Bot Fight Mode" (gratuit)

# 8. Configurer les headers
#    Allez dans "Rules" > "Transform Rules" > "Modify Response Header"
#    Ajoutez les headers de sécurité :
#    - X-Frame-Options: DENY
#    - X-Content-Type-Options: nosniff
#    - Referrer-Policy: strict-origin-when-cross-origin
#    - Permissions-Policy: camera=(), microphone=(), geolocation=()

# 9. Configurer le SSL/TLS
#    - Allez dans "SSL/TLS" > "Overview"
#    - Sélectionnez "Full (strict)" pour un chiffrement complet
#    - Activez "Always Use HTTPS"

# 10. Configurer les pages rules (optionnel)
#     Allez dans "Rules" > "Page Rules"
#     - Cache Level: Cache Everything pour /assets/*
#     - Edge Cache TTL: 1 month pour /assets/*
#     - Browser Cache TTL: 1 month pour /assets/*

# Benefits :
# - CDN mondial (300+ datacenters)
# - Protection DDoS gratuite
# - Compression Brotli
# - Cache intelligent
# - SSL gratuit
# - Analytics de base
