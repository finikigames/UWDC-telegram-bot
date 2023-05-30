FROM node:alpine

RUN apk add git
# Create app directory
RUN git clone https://github.com/antontidev/emias-telegram-bot.git /home/admin/>

WORKDIR /home/admin/uwdc
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copi>
# where available (npm@5+)

COPY emias-telegram-bot/package*.json ./
COPY emias-telegram-bot/server*.js ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "node", "server.js" ]
