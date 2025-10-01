import { Contact } from "./phone.models";

export interface Player {
    id: string; // Server ID for the player
    name: string;
    avatar?: string;
}

export interface PaymentRequest {
    amount: number;
    note?: string;
}

export type AirdropItem = Contact | PaymentRequest;
export type AirdropItemType = 'contact' | 'photo' | 'payment_request';
export type SendProgress = 'idle' | 'sending' | 'sent' | 'failed';

export interface AirdropRequest {
    sender: Player;
    item: AirdropItem;
    itemType: AirdropItemType;
}