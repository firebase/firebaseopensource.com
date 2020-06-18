PROD_PROJECT="fir-oss"

cloud-build:
	gcloud --project=$(PROD_PROJECT) builds submit --config static/cloudbuild.yaml static

build-shared:
	npm install

build-functions: build-shared
	cd functions \
		&& npm install \
		&& npm run build \
		&& cd -

deploy-functions: build-functions
	firebase --project=$(PROD_PROJECT) deploy --only functions

build-hosting: build-shared
	cd frontend \
		&& npm install \
		&& npm run export \
		&& cd -

deploy-hosting: build-hosting
	firebase --project=$(PROD_PROJECT) deploy --only hosting

deploy: deploy-functions deploy-hosting
