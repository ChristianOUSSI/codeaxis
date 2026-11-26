# Configuration UptimeRobot pour CODE AXIS
# À configurer dans votre tableau de bord UptimeRobot

# Monitors à créer :

1. **Site Principal**
   - URL: https://codeaxis.vercel.app
   - Type: HTTP(s)
   - Interval: 5 minutes
   - Timeout: 30 seconds
   - Alert contacts: Email, SMS, Slack (optionnel)

2. **API Contact**
   - URL: https://codeaxis.vercel.app/api/contact
   - Type: HTTP(s)
   - Interval: 15 minutes
   - Timeout: 30 seconds
   - Expected status: 405 (Method Not Allowed for GET)

3. **Service Worker**
   - URL: https://codeaxis.vercel.app/sw.js
   - Type: HTTP(s)
   - Interval: 30 minutes
   - Timeout: 30 seconds

4. **Pages Clés**
   - https://codeaxis.vercel.app/index.html
   - https://codeaxis.vercel.app/actualites.html
   - https://codeaxis.vercel.app/nos-projets.html
   - https://codeaxis.vercel.app/suite-evo.html
   - https://codeaxis.vercel.app/faq.html
   - https://codeaxis.vercel.app/temoignages.html
   - https://codeaxis.vercel.app/blog.html
   - https://codeaxis.vercel.app/portfolio.html
   - https://codeaxis.vercel.app/tarifs.html

# Alert settings :
# - Email alerts : contact@codeaxis.cm
# - SMS alerts : +237691223916 (optionnel)
# - Slack/Discord webhook (optionnel)
# - Alert after: 2 consecutive failures
# - Recovery alerts: enabled

# Status page (optionnel) :
# - Create public status page
# - URL: status.codeaxis.cm (requires custom domain)
