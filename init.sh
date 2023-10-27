#!/bin/sh

set -e

cd "$(dirname "$0")"

find setting/workspace -type f | cut -c 19- | sed s/\\.txt$// | while IFS= read -r WORKSPACE_NAME; do
  < "setting/workspace/$WORKSPACE_NAME.txt" sed s=^=setting/include/= | sed s/$/.txt/ | xargs cat > "$WORKSPACE_NAME.code-workspace"
done
