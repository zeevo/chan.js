FROM node:16

COPY . .

RUN apt update

RUN apt install -y chromium

RUN npm install

RUN npm run prisma:migrate

CMD ["npm", "run", "start"]
