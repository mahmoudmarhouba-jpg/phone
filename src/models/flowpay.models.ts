export interface FlowPayAccount {
  accountNumber: string;
  ownerName: string;
  balance: number;
}

export interface FlowPayTransaction {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  party: string; // Recipient or sender name/number
  note?: string;
  timestamp: number;
}
