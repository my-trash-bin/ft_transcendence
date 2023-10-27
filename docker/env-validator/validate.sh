#!/bin/sh

set -e

(cd "$(dirname "$0")/../.." && docker build -t ft_transcendence-env-validator -f docker/env-validator/Dockerfile .)

docker run -i ft_transcendence-env-validator < "$1"
