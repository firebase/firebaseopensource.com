#!/bin/bash
set -e

# Clone source
git clone -b goodbye-rendertron https://github.com/firebase/firebaseopensource.com
cd firebaseopensource.com

# Build and deploy
make deploy-hosting
