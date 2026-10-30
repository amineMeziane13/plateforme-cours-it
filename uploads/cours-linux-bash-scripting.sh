#!/usr/bin/env bash
# Script de monitoring système pour serveurs Linux de cours
set -euo pipefail

echo "=== RAPPORT SYSTÈME DU SERVEUR IT ==="
echo "Date : $(date)"
echo "Charge CPU : $(uptime | awk -F'load average:' '{ print $2 }')"
echo "Mémoire RAM libre :"
free -h | grep "Mem:"
echo "Espace disque / :"
df -h / | awk 'NR==2 {print "Utilisé: " $3 " / Total: " $2 " (" $5 ")"}'
