export enum DeviceStatus {
  off = 'off',
  on = 'on',
  processing = 'processing'
}

export const DeviceStatuIcon: Record<DeviceStatus, string> = {
  [DeviceStatus.off]: '🔴',
  [DeviceStatus.on]: '✅',
  [DeviceStatus.processing]: '🔵',
}

export const NextDeviceStatus: Record<DeviceStatus.on | DeviceStatus.off, DeviceStatus.off | DeviceStatus.on> = {
  [DeviceStatus.off]: DeviceStatus.on,
  [DeviceStatus.on]: DeviceStatus.off,
}

export const ButtonTitle = {
  ready: 'Choose device',
  processing: 'Updating...',
}