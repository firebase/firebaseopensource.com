PROD_PROJECT="fir-oss"

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
	cd frontend \
		&& firebase --project=$(PROD_PROJECT) deploy --only hosting \
		&& cd -

deploy: deploy-functions deploy-app
