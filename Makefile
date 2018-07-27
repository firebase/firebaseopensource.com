PROD_PROJECT="fir-oss"

build-appengine:
	cd appengine \
		&& npm install \
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
	cd frontend \
		&& yarn install \
		&& npm run build

deploy-functions: build-functions
	firebase --project=$(PROD_PROJECT) deploy --only functions
	gcloud --project=${PROD_PROJECT} functions deploy dailyGetAllProjects --memory 2048 --timeout 540
	gcloud --project=${PROD_PROJECT} functions deploy getAllProjects --memory 2048 --timeout 540
	gcloud --project=${PROD_PROJECT} functions deploy getProject --memory 2048 --timeout 540
    gcloud --project=${PROD_PROJECT} functions deploy pageRender --memory 2048 --timeout 540
    gcloud --project=${PROD_PROJECT} functions deploy pagePrerender --memory 2048 --timeout 540

deploy-hosting: build-hosting
	firebase --project=$(PROD_PROJECT) deploy --only hosting

deploy-firebase: deploy-functions deploy-hosting

deploy: deploy-appengine deploy-firebase
