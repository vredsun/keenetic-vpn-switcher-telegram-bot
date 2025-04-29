import KeeneticService from "src/keenetic/service";
import TelegramBotService from "src/telegram/service";
import { ButtonTitle, DeviceStatus, NextDeviceStatus } from "./constants";
import { DeviceMeta } from "./model";
import { getBotMessageText, getMessageKeyboard } from "./utils";

type ChatId = number;
type MessageId = number;

class StateService {
  #chats = new Map<ChatId, MessageId>();

  #state: Map<string, DeviceMeta> = new Map();

  #keeneticService: KeeneticService;

  #botService: TelegramBotService;

  constructor(keeneticService: KeeneticService, botService: TelegramBotService) {
    this.#keeneticService = keeneticService;
    this.#botService = botService;
  }

  init = async () => {
    const data = await this.#keeneticService.getDevicesStatus();

    if (data.result) {
      Object.entries(data.result).forEach(([mac, deviceMeta]) => {
        if (deviceMeta) {
          this.#state.set(mac, { ...deviceMeta })
        }
      })
    }
  }

  saveChat = (chatId: ChatId, messageId: MessageId): void => {
    this.#chats.set(chatId, messageId);
  }

  onStart = async (chatId: ChatId): Promise<void> => {
    if (!this.#state.size) {
      this.#botService.sendMessage(chatId, ButtonTitle.processing);
      return;
    }

    const message = await this.#botService.sendMessage(chatId, ButtonTitle.ready, {
      reply_markup: {
        inline_keyboard: getMessageKeyboard(this.#state),
      },
    })

    this.saveChat(chatId, message.message_id);
  }

  editState = (mac: string, status: DeviceStatus) => {
    this.#state.get(mac)!.status = status;
    
    const text = getBotMessageText(status);

    this.#chats.forEach((messageId, chatId) => {
      this.#botService.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
          inline_keyboard: getMessageKeyboard(this.#state),
        },
      });
    })
  }

  toggleMacStatus = async (mac: string) => {
    const deviceStatus = this.#state.get(mac)?.status;

    if (!deviceStatus || deviceStatus === DeviceStatus.processing) {
      return;
    }

    this.editState(mac, DeviceStatus.processing);

    let changedDeviceStatus = NextDeviceStatus[deviceStatus];

    const response = await this.#keeneticService.changeVpnStatus(mac, changedDeviceStatus);
    
    if (response.error) {
      changedDeviceStatus = NextDeviceStatus[changedDeviceStatus];
    }

    this.editState(mac, changedDeviceStatus);
  }
}

export default StateService;
