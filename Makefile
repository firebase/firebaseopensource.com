PROD_PROJECT="fir-oss"

cloud-build:
	gcloud --project=$(PROD_PROJECT) builds submit --config static/cloudbuild.yaml static

build-functions:
	cd functions \
		&& npm install \
		&& npm run build \
		&& cd -

deploy-functions: build-functions
	firebase --project=$(PROD_PROJECT) deploy --only functions

build-hosting:
	cd frontend \
		&& npm install \
		&& npm run get-routes \
		&& npm run gen \
		&& cd -

deploy-hosting: build-hosting
	firebase --project=$(PROD_PROJECT) deploy --only hosting

deploy: deploy-functions deploy-hosting
