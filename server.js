const token = process.env.TOKEN;
const gameUrl = process.env.GAME_URL;
const gameName = process.env.GAME_NAME;

const queries = {};

const TelegramApi = require('node-telegram-bot-api')
const bot = new TelegramApi(token, {polling: true})

const GameStraightUrl = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: 'Прямая сыллка(для IOS)', callback_data: '/iosLink'}],
        ]
    })
}

const start = () => {
    bot.setMyCommands( [
        {command: '/start', description: 'Приветствие'},
        {command: '/game', description: 'Отобразить игру'},
    ])

    bot.on('message', function(msg, reply, next) {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            return bot.sendMessage(chatId, `Привет! 
            \nЭто команда Infinnity Solutions. 
            \nМы приготовили для тебя игру в поддавки с призами и подарками. 
            \nГлавная цель игры — избавиться от всех своих фигур, подвергая их уничтожению противником. 
            \nСражайся, войди в топ-3, и забирай кайфовые призы: наушники Apple AirPods Pro 2, мощные аккумуляторы, портативные колонки, стильные термосы. 
            \nПоделись контактом, чтобы зарегистрироваться.`)
        }

        if (text === '/game') {
            bot.sendGame(msg.from.id, gameName);
            return bot.sendMessage(chatId, `Удачи в игре, если ты выиграешь в турнире, то получишь приз!`, GameStraightUrl);
        }

        return bot.sendMessage(chatId, 'Если ты хочешь поиграть, напиши /game')
    })

    bot.on('callback_query', msg => {
        var found = false;
        for(var i = 0; i < queries.length; i++) {
            if (queries[i] == msg) {
                found = true;
                break;
            }
        }

        if (found) {
            bot.sendMessage(chatId, `Спасибо за игру. Приходи 03.06.23 на конференцию UWDC. В 12:40 на стенде Infinnity Solutions подведем итоги и вручим долгожданные призы игрокам, вошедшим в топ–3. 

            Подписывайся на телеграмм-канал о работе в Infinnity Solutions. Делимся профессиональным опытом, рассказываем о жизни и работе наших команд, открытых вакансиях и новостях.
            
            P.S. Это первое и единственное сообщение от нас, обещаем не спамить 😌`);
        }
        queries[msg.id] = msg;
        const chatId = msg.message.chat.id;
        
        console.log(msg.data);
        
        console.log('---START-----USER_DATA_BLOCK-----START---');
        console.log('USER_ID - '+msg.from.id);
        console.log('USER_NAME - '+msg.from.first_name);
        console.log('USER_LAST_NAME - '+msg.from.last_name);
        console.log('USER_USERNAME - '+msg.from.username);
        console.log('---END-----USER_DATA_BLOCK-----END---');

        let formatedName = '';
        let formatedLastName = '';

        if (msg.from.first_name) {
            formatedName = msg.from.first_name.replace(/\s/g, '');
        }

        if (msg.from.last_name) {
            formatedLastName = msg.from.last_name.replace(/\s/g, '');
        }
        
        let gameurl = gameUrl+"index.html?id="+msg.from.id+"0000"+"&first_name="+formatedName+"&last_name="+formatedLastName+"&username="+msg.from.username;
        console.log(gameurl);
        
        if (msg.data === '/iosLink') {
            return bot.sendMessage(chatId, gameurl);
        }

        bot.answerCallbackQuery(msg.id, {url: gameurl});
    })
}

start()
