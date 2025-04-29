import { DeviceStatus } from "./constants";

export type DeviceName = string;

export type DeviceMeta = {
  name: string;
  status: DeviceStatus;
}