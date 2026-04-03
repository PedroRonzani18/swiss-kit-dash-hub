#!/bin/sh
set -e

RDS_CA_BUNDLE="/usr/local/share/aws-rds-ca-bundle.pem"
if [ -f "$RDS_CA_BUNDLE" ]; then
  export NODE_EXTRA_CA_CERTS="$RDS_CA_BUNDLE"
fi

echo "[startup] Iniciando aplicação..."
exec "$@"
