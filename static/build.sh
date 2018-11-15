#!/bin/bash
set -e

# Clone source
git clone https://github.com/firebase/firebaseopensource.com
cd firebaseopensource.com

# Build and deploy
make build-hosting
cd frontend
firebase --project="fir-oss" deploy --only hosting
