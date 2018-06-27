PROD_PROJECT="fir-oss"

build-appengine:
	cd appengine \
		&& rm -rf lib env \
		&& virtualenv env && source env/bin/activate \
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

deploy-functions: build-functions
	firebase --project=$(PROD_PROJECT) deploy --only functions

deploy-hosting: build-hosting
	firebase --project=$(PROD_PROJECT) deploy --only hosting

deploy-firebase: deploy-functions deploy-hosting

deploy: deploy-appengine deploy-firebase
