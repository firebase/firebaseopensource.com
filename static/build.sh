#!/bin/bash
set -e

# Auth with service account
gcloud auth activate-service-account --key-file service-account.json

# Clone source
git clone -b static-site https://github.com/firebase/firebaseopensource.com
cd firebaseopensource.com/static

# Download all HTML
gsutil -m cp -r gs://fir-oss.appspot.com/prod/* ./public/

# Deploy with Firebase
firebase deploy --only hosting