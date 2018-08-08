PROD_PROJECT="fir-oss"

build-functions:
	cd functions \
		&& yarn install \
		&& npm run build \
		&& cd -

deploy-functions: build-functions
	firebase --project=$(PROD_PROJECT) deploy --only functions

build-app:
	cd frontend \
		&& yarn install \
		&& npm run build

deploy-app: build-app
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
		     SIZE=$$(curl -s -w \%{size_header} -o /dev/null http://35.184.136.77/package.json); \
		     [[ $$SIZE -eq 0 ]] || break;  \
		     sleep 5; \
		   done \
		&& echo "Looks deployed!"

deploy: deploy-functions deploy-app
