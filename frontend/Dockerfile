FROM node:latest

EXPOSE 5000
CMD git clone https://github.com/firebase/firebaseopensource.com.git /app && \
    cd /app/frontend && \
    npm install && \
    npm run build && \
    npx serve