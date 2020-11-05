#!/bin/bash
set -e

export SERVER=68.183.128.101

./scripts/upload-code.sh
./scripts/install-code.sh