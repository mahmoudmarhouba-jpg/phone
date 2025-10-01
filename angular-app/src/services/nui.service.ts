import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// A generic interface for NUI messages for better type safety
export interface NuiMessage<T = any> {
  action: string;
  payload: T;
}

@Injectable({
  providedIn: 'root',
})
export class NuiService {
  private messageSubject = new Subject<NuiMessage>();
  public messages$ = this.messageSubject.asObservable();
  private readonly resourceName = 'neo-call';

  constructor() {
    // Listen for messages from the FiveM client and broadcast them internally
    window.addEventListener('message', (event: MessageEvent<NuiMessage>) => {
      if (event.data && event.data.action) {
        this.messageSubject.next(event.data);
      }
    });
  }

  /**
   * Posts a message to the NUI listening frame in the FiveM client.
   * @param action The action to be performed (must match a RegisterNUICallback in the client script)
   * @param payload The data to send
   */
  private postNuiMessage(action: string, payload: unknown = {}) {
    try {
        fetch(`https://${this.resourceName}/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify(payload),
        });
    } catch(e) {
        console.error(`[NeoCall] Failed to post NUI message for action '${action}':`, e);
    }
  }

  public closePhone() {
    this.postNuiMessage('closePhone');
  }

  public sendMessage(to: string, text: string) {
    this.postNuiMessage('sendMessage', { to, text });
  }

  public startCall(number: string) {
    this.postNuiMessage('startCall', { number });
  }

  public sendAirdrop(payload: { targetId: string, item: any, itemType: string }) {
    this.postNuiMessage('airdrop:send', payload);
  }

  public flowpayTransfer(recipient: string, amount: number, note: string) {
    this.postNuiMessage('flowpay:transfer', { recipient, amount, note });
  }
}
