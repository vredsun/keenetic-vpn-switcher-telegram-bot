import KeeneticService from "./keenetic/service";
import StateService from "./state/service";
import TelegramBotService from './telegram/service';

const keeneticService = new KeeneticService();
const botService = new TelegramBotService();
const stateService = new StateService(keeneticService, botService);
stateService.init();

const run = async () => {
  botService.setMyCommands([
    {
      command: '/start',
      description: 'On/Off vpn'
    }
  ])

  botService.onText(/\/start/, (message) => {
    const chatId = message.chat.id

    stateService.onStart(chatId)
  });

  botService.onCallbackQuery(async (callbackQuery) => {
    const changedMac = callbackQuery.data;
    const chatId = callbackQuery?.message?.chat.id;
    const messageId = callbackQuery?.message?.message_id;

    if (!chatId || !messageId || !changedMac) {
      return;
    }

    stateService.saveChat(chatId, messageId);
    stateService.toggleMacStatus(changedMac);
  });
}

run();
