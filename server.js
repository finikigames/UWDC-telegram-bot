const token = process.env.TOKEN;
const gameUrl = process.env.GAME_URL;
const gameName = process.env.GAME_NAME;

const queries = {};
const chats = {};
const endTournamentStamp = process.env.END_STAMP;
const byeMessageStamp = process.env.BYE_STAMP;

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
            console.log(chats[chatId]);

            if (chats[chatId] == null) {
                scheduleMesage(chatId);
                chats[chatId] = "Active";
            }

            return bot.sendMessage(chatId, `Привет!
            \nЭто команда <a href="https://Finiki.games">Finiki.games</a>.Мы приготовили для тебя игру в Поддавки с призами и подарками.
Главная цель игры — избавиться от всех своих фигур, подвергая их уничтожению противником.
            \nВремя игр: 7 июня с 20.00  до 24.00; 
8 июня с 00.00 до 05.00 - ночная лига.
            \nсбор участников Лиги поддающихся джентльменов для розыгрыша призов  в Зале Galaxy в 14.40,
раздача призов всем участникам на стойке регистрации с 15 до 16.00
            \nЧтобы начать играть, напиши /game`, {parse_mode: 'HTML'})
        }

        if (text === '/game') {
            return bot.sendGame(msg.from.id, gameName);
            //return bot.sendMessage(chatId, `Удачи в игре, если ты выиграешь в турнире, то получишь приз!>
        }

        return bot.sendMessage(chatId, 'Если ты хочешь поиграть, напиши /game')
    })

    bot.on('callback_query', msg => {
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

        let gameurl = gameUrl+msg.from.id+"0000"+"&first_name="+formatedName+"&last_name="+formatedLastName+"&username="+msg.from.username;
        console.log(gameurl);

        //if (msg.data === '/iosLink') {
        return bot.sendMessage(chatId, `<a href="${gameurl}">Ссылка</a>`, {parse_mode: 'HTML'});
        //}

        //bot.answerCallbackQuery(msg.id, {url: gameurl});
    })
}

function scheduleMesage(chatId) {
    let nowStamp = Date.now();
    let endStamp = parseInt(endTournamentStamp);
    let awaitTime = endStamp - nowStamp;
    if (awaitTime > 0) {
        setTimeout(function() {SendMessage(chatId);}, awaitTime);
    }
    console.log("NOW STAMP is "+nowStamp+" await for "+awaitTime+" in milliseconds. Total "+endTournamentStamp+" as number "+endStamp);

    let byeStamp = parseInt(byeMessageStamp);
    let awaitByeTime = byeStamp - nowStamp;
    if (awaitByeTime > 0) {
        setTimeout(function() {SendByeMessage(chatId);}, awaitByeTime);
    }
    console.log("NOW STAMP is "+nowStamp+" await for "+awaitByeTime+" in milliseconds. Total "+byeMessageStamp+" as number "+byeStamp);
}

function SendMessage(chatId) {
    bot.sendMessage(chatId, `Ты достойно сражался! Результаты игры доступны по <a href="https://docs.google.com/spreadsheets/d/1iBO1RvSBtuZWpo6e4SvbFHBo_XjLZJiooTvIyMM-aTI/edit#gid=0">ссылке</a>. Cбор участников Лиги поддающихся джентльменов для розыгрыша призов  в Зале Galaxy в 14.40,
раздача призов всем участникам на стойке регистрации с 15 до 16.00
    \nЕсли ты любишь мобильные мидкорные игры, разбираешься в их устройстве, либо мечтаешь разобраться (механики, баланс и проч.), присоединяйся к команде <a href="https://Finiki.games">Finiki.games</a>!
Мы придерживаемся принципов открытости и непрерывного развития. Уважаем мнение других и готовы помочь в любой ситуации. 
Даем возможность каждому сотруднику учиться и повышать свои профессиональные навыки, обеспечиваем все соц. гарантии с соблюдением ТК РФ. 
А еще у нас нескучная корпоративная жизнь и солидная заработная плата.`, {parse_mode: 'HTML'});
}

function SendByeMessage(chatId) {
    bot.sendMessage(chatId, `Привет, это <a href="https://Finiki.games">Finiki.games</a>! Рады были увидеться с тобой на UWDC 2024 💕 Спасибо, что поучаствовал в онлайн-турнире.
    \nУ нас открыты вакансии: <a href="https://finiki.games/leadgamedesigner">Lead Game Designer</a> и <a href="https://finiki.games/game_designer">Game Designer</a>. От соискателя ждем релевантный опыт работы. 
Если ты соответствуешь лишь части пунктов — все равно откликайся. Мы готовы научить, если чего-то не хватает.
    \nПоявились предложения и/или вопросы о работе в команде Finiki.games — пиши нашему HR <a href="https://t.me/HR_IS">Юлии</a>.`, {parse_mode: 'HTML'});
}

start()
