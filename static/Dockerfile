FROM google/cloud-sdk:alpine
RUN apk add --update nodejs
RUN gcloud components install gsutil
RUN npm install -g firebase-tools
COPY ./build.sh build.sh
CMD ./build.sh