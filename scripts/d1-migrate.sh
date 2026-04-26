#!/bin/bash
# Applies D1 schema migrations to the remote subscribers database.
# Run after any schema.sql change.
set -e

echo "Applying D1 schema to remote subscribers database..."
npx wrangler d1 execute subscribers --remote --file=functions/api/schema.sql
echo "Done."
