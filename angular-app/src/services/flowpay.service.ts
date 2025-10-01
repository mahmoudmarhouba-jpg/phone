import { Injectable, signal, computed, inject } from '@angular/core';
import { FlowPayAccount, FlowPayTransaction } from '../models/flowpay.models';
import { NuiService } from './nui.service';
import { filter } from 'rxjs/operators';

// MOCK DATA
const MOCK_ACCOUNT: FlowPayAccount = {
  accountNumber: 'DE89 3704 0044 0532 0130 00',
  ownerName: 'Tony Hayes',
  balance: 42750.25,
};

const MOCK_FLOWPAY_TRANSACTIONS: FlowPayTransaction[] = [
  { id: 'ft1', type: 'incoming', amount: 5000, party: 'Paycheck', note: 'Monthly Salary', timestamp: Date.now() - 86400000 * 2 },
  { id: 'ft2', type: 'outgoing', amount: 125.50, party: 'Ammunation', note: 'Supplies', timestamp: Date.now() - 86400000 * 1 },
  { id: 'ft3', type: 'outgoing', amount: 800, party: 'Liam T.', note: 'Car repair', timestamp: Date.now() - 3600000 * 6 },
  { id: 'ft4', type: 'incoming', amount: 250, party: 'Ava J.', note: 'Dinner last night', timestamp: Date.now() - 3600000 * 2 },
];

export type FlowPayView = 'dashboard' | 'transfer' | 'history' | 'receive';

@Injectable({ providedIn: 'root' })
export class FlowPayService {
    private nuiService = inject(NuiService);

    // === STATE ===
    account = signal<FlowPayAccount>(MOCK_ACCOUNT);
    transactions = signal<FlowPayTransaction[]>(MOCK_FLOWPAY_TRANSACTIONS);
    currentView = signal<FlowPayView>('dashboard');

    // === DERIVED STATE ===
    recentTransactions = computed(() => this.transactions().slice(0, 5).sort((a,b) => b.timestamp - a.timestamp));

    constructor() {
        // Listen for real NUI events to update the balance
        this.nuiService.messages$.pipe(
            filter((message): message is { action: 'flowpay:update', payload: { transaction: FlowPayTransaction, newBalance: number } } => message.action === 'flowpay:update')
        ).subscribe(message => {
            this.transactions.update(txs => [message.payload.transaction, ...txs]);
            this.account.update(acc => ({...acc, balance: message.payload.newBalance }));
        });
    }

    // === ACTIONS ===
    setView(view: FlowPayView) {
        this.currentView.set(view);
    }

    sendTransfer(recipient: string, amount: number, note: string) {
        // 1. Post to NUI for server-side validation and execution
        this.nuiService.flowpayTransfer(recipient, amount, note);

        // 2. The server will handle the transaction and send back a 'flowpay:update'
        //    event if it's successful, which the constructor listener will handle.
        //    This avoids optimistic updates that might be incorrect.

        // 3. Return to dashboard after sending the request
        this.setView('dashboard');
    }

    receiveAirdropPayment(senderName: string, amount: number, note?: string) {
        const incomingPayment: FlowPayTransaction = {
            id: `ft${Date.now()}`,
            type: 'incoming',
            amount,
            party: senderName,
            note: note || 'NexaAir Payment',
            timestamp: Date.now(),
        };
        this.transactions.update(txs => [incomingPayment, ...txs]);
        this.account.update(acc => ({...acc, balance: acc.balance + amount }));
        // TODO: Add notification badge to app icon
    }
}