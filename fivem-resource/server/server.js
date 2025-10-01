// --- NeoCall FiveM Server Script ---

// This is a simplified server script. In a real environment, you would integrate this
// with your framework (ESX, QBCore, etc.) to get player data, check balances,
// find players by phone number, etc.

/**
 * Handles receiving an SMS message from a client.
 * It should find the target player and forward the message.
 */
onNet('neocall:server:sendMessage', (payload) => {
    const source = global.source;
    console.log(`[NeoCall] Player ${source} is sending SMS to ${payload.to}: "${payload.text}"`);

    // --- FRAMEWORK INTEGRATION ---
    // 1. Get the source player's character/phone number.
    // 2. Find the target player's server ID based on the recipient phone number (`payload.to`).
    // 3. If the target player is online, trigger a client event for them.
    // 4. If offline, save the message to the database to be delivered later.

    // For this example, we'll just pretend the recipient is the sender to demonstrate the loop.
    const targetSource = source; 
    
    // This payload would be sent to the recipient
    const recipientPayload = {
        from: '555-SENDER', // This should be the sender's actual number
        text: payload.text,
    };

    emitNet('neocall:client:receiveMessage', targetSource, recipientPayload);
});


/**
 * Handles a FlowPay transfer request.
 * It should validate the transfer, update balances, and notify both parties.
 */
onNet('neocall:server:flowpayTransfer', (payload) => {
    const source = global.source;
    const { recipient, amount, note } = payload;
    console.log(`[NeoCall] Player ${source} is transferring $${amount} to ${recipient} with note: "${note}"`);

    // --- FRAMEWORK INTEGRATION ---
    // 1. Get the source player's character object.
    // 2. Check if the source player has enough money in their bank account.
    // 3. Find the target player's character object based on the recipient identifier.
    // 4. If all checks pass:
    //    a. Deduct the amount from the source player's account.
    //    b. Add the amount to the target player's account.
    //    c. Create transaction records in the database for both players.
    //    d. Trigger client events to notify both players of the updated balance and transaction.
    
    // Mock success notifications for demonstration purposes.
    const senderTransaction = {
        id: `ft_s_${Date.now()}`,
        type: 'outgoing',
        amount: amount,
        party: recipient, // In a real system, this would be the recipient's name
        note: note,
        timestamp: Date.now(),
    };
    const newSenderBalance = 10000; // This would be the new balance from the database
    emitNet('neocall:client:flowpayUpdate', source, { transaction: senderTransaction, newBalance: newSenderBalance });

    // Find the target player and send them their update
    const targetSource = -1; // Replace with framework function to get player by identifier
    if (targetSource > 0) {
        const recipientTransaction = {
            id: `ft_r_${Date.now()}`,
            type: 'incoming',
            amount: amount,
            party: 'Player Name', // This would be the sender's name
            note: note,
            timestamp: Date.now(),
        };
        const newRecipientBalance = 20000; // New balance from DB
        emitNet('neocall:client:flowpayUpdate', targetSource, { transaction: recipientTransaction, newBalance: newRecipientBalance });
    }
});


/**
 * Handles an AirDrop send request.
 * In a real scenario, this would involve proximity checks.
 */
onNet('neocall:server:airdropSend', (payload) => {
    const source = global.source;
    const { targetId, item, itemType } = payload;
    console.log(`[NeoCall] Player ${source} is AirDropping item to server ID ${targetId}`);

    // --- FRAMEWORK INTEGRATION ---
    // 1. Get source player's character data (name, etc.).
    // 2. IMPORTANT: Verify proximity between source and targetId to prevent abuse.
    // 3. If players are close enough, construct the payload for the recipient.
    
    const senderInfo = {
        id: source, // In a real app, use a character ID, not server ID
        name: 'A Player Nearby' // Get sender's name from your framework
    };

    const recipientPayload = {
        sender: senderInfo,
        item: item,
        itemType: itemType,
    };

    emitNet('neocall:client:airdropReceive', targetId, recipientPayload);
});


console.log('[NeoCall] Server script loaded.');
