This folder is based on:
https://github.com/firebase/functions-cron

## Deployment

```
# Install dependencies
pip install -t lib -r requirements.txt


# Create appengine app (if not already done)
gcloud app create

# Deploy the app
gcloud app deploy app.yaml cron.yaml
```

