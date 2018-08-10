PROD_PROJECT="fir-oss"

build-docker:
	cd static \
		&& docker build -t static-renderer . \
		&& docker tag static-renderer us.gcr.io/fir-oss/static-renderer \
		&& cd -

deploy-docker: build-docker
	docker push us.gcr.io/fir-oss/static-renderer

deploy-cronjobs: deploy-docker
	gcloud container clusters get-credentials --zone=us-central1-a cronjobs
	kubectl create -f cronjobs/daily-renderstatic.yaml
	kubectl create -f cronjobs/daily-getallprojects.yaml

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

deploy: deploy-functions deploy-hosting
