// --- NeoCall FiveM Client Script ---

let phoneVisible = false;

// --- Keybinds & Controls ---

// Register the command to open the phone.
// You can also use RegisterKeyMapping for a configurable key in the user's settings.
RegisterCommand('phone', () => {
    togglePhone(!phoneVisible);
}, false);

// Register a key mapping for the phone
RegisterKeyMapping('phone', 'Open Phone', 'keyboard', 'F1');


/**
 * Toggles the phone's visibility and NUI focus.
 * @param {boolean} visible - Whether the phone should be visible or not.
 */
function togglePhone(visible) {
    phoneVisible = visible;
    SetNuiFocus(visible, visible);
    
    // Send a message to the NUI to inform it of the visibility change.
    // This allows the Angular app to show itself.
    SendNUIMessage({
        action: 'setVisible',
        payload: visible
    });
}

// You can also use an event to open the phone from other scripts
onNet('neocall:client:openPhone', () => {
    if (!phoneVisible) {
        togglePhone(true);
    }
});


// --- NUI Callback Handlers ---
// These handlers receive messages from the Angular app.

/**
 * Handles the 'closePhone' action from the NUI.
 */
RegisterNUICallback('closePhone', (data, cb) => {
    togglePhone(false);
    cb({ status: 'ok' }); // Acknowledge the callback
});

/**
 * Forwards an SMS message to the server for processing.
 */
RegisterNUICallback('sendMessage', (data, cb) => {
    emitNet('neocall:server:sendMessage', data);
    cb({ status: 'ok' });
});

/**
 * Forwards a FlowPay transfer request to the server.
 */
RegisterNUICallback('flowpay:transfer', (data, cb) => {
    emitNet('neocall:server:flowpayTransfer', data);
    cb({ status: 'ok' });
});

/**
 * Forwards a call initiation request to the server.
 */
RegisterNUICallback('startCall', (data, cb) => {
    // In a real voice system, you would handle this here or on the server.
    console.log(`[NeoCall] Initiating call to ${data.number}`);
    emitNet('neocall:server:startCall', data);
    cb({ status: 'ok' });
});

/**
 * Forwards an AirDrop send request to the server.
 */
RegisterNUICallback('airdrop:send', (data, cb) => {
    // AirDrop logic is complex and would require proximity checks.
    // For now, we'll just log it and forward to the server.
    console.log(`[NeoCall] AirDropping to target ${data.targetId}`);
    emitNet('neocall:server:airdropSend', data);
    cb({ status: 'ok' });
});


// --- Server Event Handlers ---
// These handlers receive messages from the server.

/**
 * Receives an SMS message from the server and forwards it to the NUI.
 */
onNet('neocall:client:receiveMessage', (payload) => {
    if (!phoneVisible) {
        // TODO: Show an in-game notification that you have a new message
    }
    SendNUIMessage({
        action: 'receiveMessage',
        payload: payload
    });
});

/**
 * Receives a FlowPay account update and forwards it to the NUI.
 */
onNet('neocall:client:flowpayUpdate', (payload) => {
    SendNUIMessage({
        action: 'flowpay:update',
        payload: payload
    });
});

/**
 * Receives an incoming AirDrop request and forwards it to the NUI.
 */
onNet('neocall:client:airdropReceive', (payload) => {
    SendNUIMessage({
        action: 'airdrop:receive',
        payload: payload
    });
});

console.log('[NeoCall] Client script loaded.');
