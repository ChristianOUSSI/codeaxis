# Sauvegarde automatique pour CODE AXIS
# Script à exécuter quotidiennement via cron ou GitHub Actions

#!/bin/bash
# backup.sh - Sauvegarde automatique du repo CODE AXIS

BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/codeaxis_backup_${DATE}.tar.gz"

# Créer le dossier de backup s'il n'existe pas
mkdir -p "$BACKUP_DIR"

# Créer l'archive (exclure node_modules et .git)
tar -czf "$BACKUP_FILE" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.tar.gz' \
  --exclude='backups' \
  .

# Garder seulement les 30 derniers backups
cd "$BACKUP_DIR"
ls -t codeaxis_backup_*.tar.gz | tail -n +31 | xargs -r rm --

# Optionnel : envoyer vers un stockage cloud (S3, Backblaze, etc.)
# aws s3 cp "$BACKUP_FILE" s3://your-bucket/backups/
# rclone copy "$BACKUP_FILE" remote:backups/

echo "Backup created: $BACKUP_FILE"
echo "Size: $(du -h "$BACKUP_FILE" | cut -f1)"
