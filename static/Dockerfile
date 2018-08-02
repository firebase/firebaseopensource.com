FROM google/cloud-sdk:alpine
RUN apk add --update nodejs
RUN gcloud components install gsutil
RUN npm install -g firebase-tools
RUN git clone -b static-site https://github.com/firebase/firebaseopensource.com
RUN cd firebaseopensource.com/static
CMD ./build.sh