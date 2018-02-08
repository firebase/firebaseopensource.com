PROD_PROJECT="fir-oss"

build-appengine:
	cd appengine \
		&& rm -rf lib \
		&& gcloud components install app-engine-python \
		&& pip install -t lib -r requirements.txt \
		&& cd -

deploy-appengine: build-appengine
	gcloud config set project $(PROD_PROJECT)
	cd appengine \
		&& gcloud --quiet app deploy app.yaml cron.yaml \
		&& cd -

build-functions:
	cd functions \
		&& yarn install \
		&& npm run build \
		&& cd -

build-hosting:
	yarn install \
		&& npm run build

deploy-firebase: build-hosting build-functions
	firebase --project=$(PROD_PROJECT) deploy

deploy: deploy-appengine deploy-firebase