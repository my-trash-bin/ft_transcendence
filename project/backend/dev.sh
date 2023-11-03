#!/bin/sh

set -e

npx get-graphql-schema http://localhost:50080/graphql > schema.graphqls
