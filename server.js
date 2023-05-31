const token = process.env.TOKEN;
const gameUrl = process.env.GAME_URL;
const gameName = process.env.GAME_NAME;

const queries = {};

const TelegramApi = require('node-telegram-bot-api')
const bot = new TelegramApi(token, {polling: true})

const start = () => {
    bot.setMyCommands( [
        {command: '/start', description: 'Приветствие'},
        {command: '/game', description: 'Отобразить игру'},
    ])

    bot.on('message', function(msg, reply, next) {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            return bot.sendMessage(chatId, `Добро пожаловать, данный бот позволяет вам поиграть в 'Поддавки' с другими игроками`)
        }

        if (text === '/game') {
            bot.sendMessage(chatId, `Удачи в игре, если ты выиграешь в рейтинге, то получишь приз!`);
            return bot.sendGame(msg.from.id, gameName);
        }

        return bot.sendMessage(chatId, 'Если ты хочешь поиграть, напиши /game')
    })

    bot.on('callback_query', msg => {
      queries[msg.id] = msg;
        const chatId = msg.message.chat.id;
        
        console.log(msg.data);
        bot.sendMessage(chatId, `Да прибудет с тобой сила`);

        let formatedName = msg.from.first_name.replace(/\s/g, '');
        let formatedLastName = msg.from.last_name.replace(/\s/g, '');
        
        let gameurl = gameUrl+"index.html?id="+msg.from.id+"0000"+"&first_name="+formatedName+"&last_name="+formatedLastName+"&username="+msg.from.username;
        console.log(gameurl);
        
        bot.answerCallbackQuery(msg.id, {url: gameurl});
    })
}

start()
