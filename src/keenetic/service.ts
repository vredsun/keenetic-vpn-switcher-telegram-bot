import {
  DEVICE_NAMES_LIST,
  HOST,
  PASSWORD,
  POLICY_NAME,
  USERNAME,
} from '../env-constants';
import { DeviceStatus } from '../state/constants';
import { DeviceMeta } from '../state/model';
import { ShowIpHotspotResponse, ShowRunningConfigResponse, SshPromiseResult } from './model';

class KeeneticService {
  #fetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`https://${HOST}/rci/${path}`, {
      ...options,
      headers: {
        'Authorization': `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
        ...options?.headers,
      },
    });

    const body = await response.json() as T;

    return body;
  }

  #getMacWithPolicySet = async () => {
    const data = await this.#fetch<ShowRunningConfigResponse>('show/running-config')

    return data.message.reduce((acc, line) => {
      const mac = line.match(/host\s(.+)\spolicy\s?\w+/)?.[1];

      if (mac) {
        acc.add(mac);
      }

      return acc;
    }, new Set<string>())
  }

  #showIpHotspot = async (): Promise<ShowIpHotspotResponse> => {
    const data = await this.#fetch<ShowIpHotspotResponse>('show/ip/hotspot')

    return data;
  }

  getDevicesStatus = async (): Promise<SshPromiseResult<Partial<Record<string, DeviceMeta>>>> => {
    try {
      const [
        showIpHotspotStdout,
        macWithPolicySet,
      ] = await Promise.all(
        [
          this.#showIpHotspot(),
          this.#getMacWithPolicySet(),
        ]
      );

      const someMeta = showIpHotspotStdout.host.reduce((acc: Partial<Record<string, DeviceMeta>>, { mac, name }) => {
        if (DEVICE_NAMES_LIST.has(name)) {
          acc[mac] = {
            name,
            status: macWithPolicySet.has(mac) ? DeviceStatus.on : DeviceStatus.off
          };
        }

        return acc;
      }, {})

      return {
        result: someMeta,
      };
    } catch (error) {
      console.error('error', error)
      return {
        error: 'error in getDevicesStatus',
      }
    }
  };

  changeVpnStatus = async (mac: string, changedStatus: DeviceStatus) => {
    try {
      if (changedStatus === DeviceStatus.on) {
        await this.#fetch(`ip/hotspot/host`, {
          method: 'POST',
          body: JSON.stringify({
            mac,
            policy: POLICY_NAME,
          })
        })
      }
      if (changedStatus === DeviceStatus.off) {
        await this.#fetch(`ip/hotspot/host/policy`, {
          method: 'POST',
          body: JSON.stringify({
            mac,
            no: true,
          })
        })
      }


      return {
        result: 'ok',
      }

      // return this.getDevicesStatus();

    } catch (error) {
      console.error(error);

      return {
        error: 'error in changeVpnStatus'
      }
    }
  }
}

export default KeeneticService;