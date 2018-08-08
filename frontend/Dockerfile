FROM node:latest

EXPOSE 5000
CMD git clone https://github.com/firebase/firebaseopensource.com.git /app && \
    cd /app/frontend && \
    npm install && \
    npm run build && \
    cd /app && \
    npx superstatic --port 5000 --host 0.0.0.0