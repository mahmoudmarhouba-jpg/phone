import { Injectable, signal, inject } from '@angular/core';
import { Player, AirdropRequest, AirdropItem, AirdropItemType, SendProgress, PaymentRequest } from '../models/airdrop.models';
import { Contact } from '../models/phone.models';
import { NuiService } from './nui.service';
import { PhoneStateService } from './phone-state.service';
import { FlowPayService } from './flowpay.service';
import { filter } from 'rxjs/operators';

// MOCK DATA for nearby players
const MOCK_NEARBY_PLAYERS: Player[] = [
    { id: 'p_nearby1', name: 'Johnny Silver', avatar: 'https://i.pravatar.cc/150?u=johnny' },
    { id: 'p_nearby2', name: 'Emily', avatar: 'https://i.pravatar.cc/150?u=emily' },
];

@Injectable({ providedIn: 'root' })
export class AirdropService {
    private nuiService = inject(NuiService);
    private phoneState = inject(PhoneStateService);
    private flowPayService = inject(FlowPayService);

    // === STATE ===
    isSendModalVisible = signal(false);
    isReceiveModalVisible = signal(false);
    
    itemToSend = signal<{ item: AirdropItem, type: AirdropItemType } | null>(null);
    nearbyPlayers = signal<Player[]>([]);
    
    incomingRequest = signal<AirdropRequest | null>(null);
    
    sendProgress = signal<SendProgress>('idle');
    sendTarget = signal<Player | null>(null);

    constructor() {
        // Listen for incoming airdrop events from the NUI service
        this.nuiService.messages$.pipe(
            filter((message): message is { action: 'airdrop:receive', payload: AirdropRequest } => message.action === 'airdrop:receive')
        ).subscribe(message => {
            this.handleIncomingRequest(message.payload);
        });
    }

    // === ACTIONS ===

    /**
     * Initiates the AirDrop process by opening the 'Send' modal.
     */
    openSendModal(item: AirdropItem, type: AirdropItemType) {
        this.itemToSend.set({ item, type });
        this.isSendModalVisible.set(true);
        this.sendProgress.set('idle');
        this.sendTarget.set(null);
        
        // In a real game, the client script would detect nearby players and send them to the NUI.
        // For now, we use a mock.
        setTimeout(() => {
            this.nearbyPlayers.set(MOCK_NEARBY_PLAYERS);
        }, 500);
    }

    /**
     * Closes the 'Send' modal and resets its state.
     */
    closeSendModal() {
        this.isSendModalVisible.set(false);
        this.nearbyPlayers.set([]);
        this.itemToSend.set(null);
    }

    /**
     * Sends an item to a target player via the NUI service.
     */
    sendItem(targetPlayer: Player) {
        const itemData = this.itemToSend();
        if (!itemData) return;
        
        this.sendTarget.set(targetPlayer);
        this.sendProgress.set('sending');

        // Post message to client script, which will forward to server
        this.nuiService.sendAirdrop({
            targetId: targetPlayer.id,
            item: itemData.item,
            itemType: itemData.type,
        });

        // Simulate network delay and success
        setTimeout(() => {
            this.sendProgress.set('sent');
            // Close modal after a short delay to show "Sent" status
            setTimeout(() => this.closeSendModal(), 1500);
        }, 2000);
    }

    /**
     * Handles an incoming AirDrop request from another player.
     */
    handleIncomingRequest(payload: AirdropRequest) {
        // Don't show if we are already in an airdrop interaction
        if (this.isSendModalVisible() || this.isReceiveModalVisible()) return;

        this.incomingRequest.set(payload);
        this.isReceiveModalVisible.set(true);
    }
    
    /**
     * Accepts an incoming AirDrop request.
     */
    acceptRequest() {
        const request = this.incomingRequest();
        if (!request) return;

        if (request.itemType === 'contact') {
            this.phoneState.addContact(request.item as Contact);
        } else if (request.itemType === 'payment_request') {
            const payment = request.item as PaymentRequest;
            this.flowPayService.receiveAirdropPayment(request.sender.name, payment.amount, payment.note);
        }
        // TODO: Handle other item types like photos

        console.log('Accepted item:', request.item);
        this.closeReceiveModal();
    }

    /**
     * Declines an incoming AirDrop request.
     */
    declineRequest() {
        console.log('Declined item');
        this.closeReceiveModal();
    }



    private closeReceiveModal() {
        this.isReceiveModalVisible.set(false);
        this.incomingRequest.set(null);
    }
}