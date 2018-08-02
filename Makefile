PROD_PROJECT="fir-oss"

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

deploy-hosting:
	echo "Connecting to cluster..." \
		&& gcloud container clusters get-credentials app --zone us-central1-a \
		&& echo "Scaling down..." \
		&& kubectl scale deployment app --replicas=0 \
		&& sleep 5 \
		&& echo "Scaling up..." \
		&& kubectl scale deployment app --replicas=1 \
		&& echo "Waiting for service to be awake..." \
		&& while : ; do \
		     echo "Waiting..."; \
		     curl http://35.184.136.77/package.json; \
		     sleep 5; \
		     [[ "$$?" -eq 0 ]] || break;  \
		   done \
		&& echo "Looks deployed!"

deploy-firebase: deploy-functions deploy-hosting

deploy: deploy-appengine deploy-firebase
