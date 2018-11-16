PROD_PROJECT="fir-oss"

cloud-build:
	gcloud builds submit --config static/cloudbuild.yaml static

build-functions:
	cd functions \
		&& yarn install \
		&& npm run build \
		&& cd -

deploy-functions: build-functions
	firebase --project=$(PROD_PROJECT) deploy --only functions

build-hosting:
	cd frontend \
		&& yarn install \
		&& npm run get-routes \
		&& npm run gen \
		&& cd -

deploy-hosting: build-hosting
	firebase --project=$(PROD_PROJECT) deploy --only hosting

deploy: deploy-functions deploy-hosting
