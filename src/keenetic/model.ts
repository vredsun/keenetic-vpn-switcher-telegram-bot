export type SshPromiseResult<T> = {
  result: T,
  error?: null;
} | {
  result?: null;
  error: string;
}

export type ShowRunningConfigResponse = {
  message: Array<string>;
}

export type ShowIpHotspotResponse = {
  host: Array<{
    mac: string;
    name: string;
  }>;
};