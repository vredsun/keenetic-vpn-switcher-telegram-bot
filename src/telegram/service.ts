import TelegramBot from "node-telegram-bot-api";
import { TELEGRAM_BOT_TOKEN, WHITE_USER_IDS_LIST } from "../env-constants";

class TelegramBotService {
  #bot: TelegramBot;

  constructor() {
    this.#bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
  }

  #authChecker = (userId: number | undefined): string | void => {
    if (!userId || !WHITE_USER_IDS_LIST.has(userId.toString())) {
      return `Not permitted for uid: ${userId}`;
    }
  }

  setMyCommands = (...params: Parameters<TelegramBot['setMyCommands']>): void => {
    this.#bot.setMyCommands(...params);
  }

  sendMessage = async (...params: Parameters<TelegramBot['sendMessage']>): Promise<TelegramBot.Message> => {
    return this.#bot.sendMessage(...params);
  }

  editMessageText = (...params: Parameters<TelegramBot['editMessageText']>): Promise<TelegramBot.Message | boolean> => {
    return this.#bot.editMessageText(...params);
  }
  
  onText = (...params: Parameters<TelegramBot['onText']>): void => {
    const [regexp, callback] = params;

    this.#bot.onText(regexp, (msg, match) => {
      const userId = msg.from?.id;
      const chatId = msg.chat.id;

      const errorMessage = this.#authChecker(userId);

      if (errorMessage) {
        console.error(errorMessage)

        this.#bot.sendMessage(chatId, errorMessage);
        return;
      }
      callback(msg, match);
    })
  }

  onCallbackQuery = (callback: (query: TelegramBot.CallbackQuery) => void) => {
    this.#bot.on('callback_query', (query) => {
      const userId = query.from?.id;
      const chatId = query.message?.chat.id;

      if (!chatId) {
        return;
      }

      const errorMessage = this.#authChecker(userId);

      if (errorMessage) {
        this.#bot.sendMessage(chatId, errorMessage);
        return;
      }

      callback(query);
    })
  };
}

export default TelegramBotService;
