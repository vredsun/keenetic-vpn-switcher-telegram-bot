import type { InlineKeyboardButton } from "node-telegram-bot-api";
import { ButtonTitle, DeviceStatuIcon, DeviceStatus } from "./constants";
import { DeviceMeta } from "./model";

export const getMessageKeyboard = (state: Map<string, DeviceMeta>): Array<Array<InlineKeyboardButton>> => {
  const keyboard: Array<Array<InlineKeyboardButton>> = [];

  state.forEach(({ name, status }, mac) => {
    keyboard.push([{
      text: `${DeviceStatuIcon[status]} ${name}`,
      callback_data: mac,
    }])
  })

  return keyboard.sort(([a], [b]) => a!.callback_data!.localeCompare(b!.callback_data!));
}

export const getBotMessageText = (status: DeviceStatus): string => {
  switch (status) {
    case DeviceStatus.processing:
      return ButtonTitle.processing;
    case DeviceStatus.on:
    case DeviceStatus.off:
      return ButtonTitle.ready;
    default:
      const statusUnknow: unknown = status;
      console.info('how?!', statusUnknow)
      return '???';
  }
}