import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private readonly DEVICE_KEY = 'x-device-id';
  private platformId = inject(PLATFORM_ID);

  getDeviceId(): string {
    if (!isPlatformBrowser(this.platformId)) return '';

    let deviceId = localStorage.getItem(this.DEVICE_KEY);

    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem(this.DEVICE_KEY, deviceId);
    }

    return deviceId;
  }
}
