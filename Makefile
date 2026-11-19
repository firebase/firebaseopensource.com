PROD_PROJECT="fir-oss"

cloud-build:
	gcloud --project=$(PROD_PROJECT) builds submit --config static/cloudbuild.yaml

build-shared:
	npm install

build-functions: build-shared
	cd functions \
		&& npm install \
		&& npm run build \
		&& cd -

deploy-functions: build-functions
	npx -y firebase-tools --project=$(PROD_PROJECT) deploy --only functions

build-hosting: build-shared
	npm --prefix=frontend install
	npm --prefix=frontend run generate
	npm --prefix=frontend run shadcn:copy

deploy-hosting: build-hosting
	npx -y firebase-tools --project=$(PROD_PROJECT) deploy --only hosting

deploy: deploy-functions deploy-hosting
