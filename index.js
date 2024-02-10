const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options.js');
const { token } = require('./token.js');

const bot = new TelegramApi(token, { polling: true });

let chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "Now I'll guess a number from 0 to 9, your task is to guess it");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'I wait for your answer!', gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Start greeting' },
    { command: '/info', description: 'Get information about user' },
    { command: '/game', description: 'Play game' }
  ]);

  bot.on('message', async msg => {
    const { text, chat } = msg;
    const chatId = chat.id;

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/c62/4a8/c624a88d-1fe3-403a-b41a-3cdb9bf05b8a/4.webp');
      return bot.sendMessage(chatId, 'Welcome to GIDEON');
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Your name is ${msg.from.first_name}`);
    }
    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'I do not understand you, try again!');
  });

  bot.on('callback_query', async msg => {
    const { data, message } = msg;
    const chatId = message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (parseInt(data) === chats[chatId]) {
      return bot.sendMessage(chatId, `Congratulations, you guessed the number ${chats[chatId]}`, againOptions);
    } else {
      return bot.sendMessage(chatId, `Unfortunately, you didn't guess the number. GIDEON guessed number ${chats[chatId]}`, againOptions);
    }
  });
};

start();
