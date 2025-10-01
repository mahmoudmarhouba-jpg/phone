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
        // This is where you would listen for real NUI events to update the balance
        // this.nuiService.messages$.pipe(
        //     filter((message): message is { action: 'flowpay:update', payload: { transaction: FlowPayTransaction, newBalance: number } } => message.action === 'flowpay:update')
        // ).subscribe(message => {
        //     this.transactions.update(txs => [message.payload.transaction, ...txs]);
        //     this.account.update(acc => ({...acc, balance: message.payload.newBalance }));
        // });

        // Simulate receiving a payment after 10 seconds to demonstrate reactivity
        setTimeout(() => {
            const incomingPayment: FlowPayTransaction = {
                id: `ft${Date.now()}`,
                type: 'incoming',
                amount: 1200,
                party: 'Weazel News',
                note: 'Ad Revenue',
                timestamp: Date.now(),
            };
            this.transactions.update(txs => [incomingPayment, ...txs]);
            this.account.update(acc => ({...acc, balance: acc.balance + incomingPayment.amount }));
            // TODO: Add notification badge to app icon
        }, 10000);
    }

    // === ACTIONS ===
    setView(view: FlowPayView) {
        this.currentView.set(view);
    }

    sendTransfer(recipient: string, amount: number, note: string) {
        // In a real app, we'd wait for a server confirmation before updating state.
        // For this mock, we'll update immediately and assume success.
        
        // 1. Post to NUI for server-side validation and execution
        this.nuiService.flowpayTransfer(recipient, amount, note);

        // 2. Optimistically update local state
        const newTransaction: FlowPayTransaction = {
            id: `ft${Date.now()}`,
            type: 'outgoing',
            amount,
            party: recipient,
            note,
            timestamp: Date.now(),
        };
        this.transactions.update(txs => [newTransaction, ...txs]);
        this.account.update(acc => ({ ...acc, balance: acc.balance - amount }));

        // 3. Return to dashboard after the transfer
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