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

  constructor() {
    // Listen for messages from the FiveM client and broadcast them internally
    window.addEventListener('message', (event: MessageEvent<NuiMessage>) => {
      if (event.data && event.data.action) {
        this.messageSubject.next(event.data);
      }
    });
  }

  /**
   * Posts a message to the NUI listening frame.
   * In a real FiveM environment, this would be `fetch(`https://resource_name/callback`, ...)`
   * @param action The action to be performed
   * @param payload The data to send
   */
  private postNuiMessage(action: string, payload: unknown = {}) {
    console.log(`[NUI Mock] Action: ${action}`, payload);
    // In a real implementation:
    // fetch(`https://your_resource_name/${action}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    //   body: JSON.stringify(payload),
    // }).catch(err => console.error(`NUI Error for action ${action}:`, err));
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
