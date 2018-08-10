#!/bin/bash
set -e

# Clone source
git clone https://github.com/firebase/firebaseopensource.com
cd firebaseopensource.com

# Build and deploy
make deploy-hosting
