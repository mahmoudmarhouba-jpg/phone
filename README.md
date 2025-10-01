# NeoCall - Modern FiveM Phone NUI

NeoCall is a feature-rich, modern smartphone UI for FiveM, built with the latest version of Angular and styled with Tailwind CSS. It provides a robust, app-based foundation that is both highly performant and easily extensible.

![Phone Preview](https://i.imgur.com/8i9uB3Z.png)

## Features

- **Modern UI/UX:** Inspired by iOS 17, with smooth animations and a clean, intuitive interface.
- **App Ecosystem:** Includes core apps like Contacts, SMS, Dialer, Settings, and a fully functional App Store (NexaStore).
- **Social Apps:** Pre-built, downloadable apps for social interaction (Z, Pixi).
- **Banking App (FlowPay):** A sophisticated banking app with transfers, history, and peer-to-peer payments via NexaAir.
- **NexaAir (AirDrop):** Share contacts and send money to nearby players with a seamless UI.
- **Customization:** Change wallpapers and themes (light/dark mode).
- **Extensible:** The Angular component structure makes it easy to add new apps and features.
- **Performance:** Built with Angular signals for a highly reactive, performant, and zoneless experience.

## Project Structure

The project is split into two main directories:

- **/angular-app:** Contains the full source code for the Angular NUI. This is where you'll develop new features, modify apps, and customize the UI.
- **/fivem-resource:** This is the actual FiveM resource folder. You will place this folder in your server's `resources` directory. It contains the necessary client/server scripts and the `html` folder for the compiled NUI.

```
/
├─ angular-app/
│  ├─ src/
│  └─ ... (all Angular project files)
├─ fivem-resource/
│  ├─ client/
│  │  └─ client.js
│  ├─ server/
│  │  └─ server.js
│  ├─ html/
│  │  └─ (This is where the built Angular app goes)
│  └─ fxmanifest.lua
└─ README.md
```

## Installation and Deployment

Follow these steps to get NeoCall running on your FiveM server.

### 1. Build the Angular NUI

First, you need to compile the Angular application.

1.  **Navigate to the Angular directory:**
    ```sh
    cd angular-app
    ```

2.  **Install dependencies:**
    *(This step requires [Node.js](https://nodejs.org/en/))*
    ```sh
    npm install
    ```

3.  **Build the application for production:**
    ```sh
    npm run build
    ```
    This command will compile the app and place the output files in `angular-app/dist/browser/`.

### 2. Prepare the FiveM Resource

1.  **Clear existing UI files:**
    Delete the placeholder `.gitkeep` file inside `fivem-resource/html/`.

2.  **Copy the built files:**
    Copy all the files from `angular-app/dist/browser/` and paste them directly into the `fivem-resource/html/` folder.

### 3. Install on Your FiveM Server

1.  **Copy the resource:**
    Place the entire `fivem-resource` folder (you can rename it, e.g., to `neo-call`) into your server's `resources` directory.

2.  **Ensure the resource in `server.cfg`:**
    Add the following line to your `server.cfg` file, making sure it matches the folder name:
    ```cfg
    ensure fivem-resource # or ensure neo-call if you renamed it
    ```

3.  **Restart your server.**

## Usage

-   **Open/Close Phone:** Press the `F1` key (by default) to open and close the phone. You can change this keybind in `fivem-resource/client/client.js`.

## For Developers: NUI Communication

NeoCall uses a standard NUI communication flow.

### Angular → FiveM Client

To send a message from an Angular component to the client script (`client.js`), use the `NuiService`.

-   **File:** `angular-app/src/services/nui.service.ts`
-   **Method:** `postNuiMessage(action: string, payload: any)`

This service sends an HTTP POST request to a special FiveM URL (`https://resource_name/action_name`), which is then captured by a NUI callback in `client.js`.

**Example (Angular):**
```typescript
// In some component method
this.nuiService.closePhone(); // Sends { action: 'closePhone' }
```

**Example (Client Script):**
```javascript
// In fivem-resource/client/client.js
RegisterNUICallback('closePhone', (data, cb) => {
  togglePhone(false);
  cb({ status: 'ok' });
});
```

### FiveM Client/Server → Angular

To send a message from a client or server script to the Angular UI, use the `SendNUIMessage` function.

-   **File:** `fivem-resource/client/client.js` or `fivem-resource/server/server.js` (via `TriggerClientEvent`)
-   **Function:** `SendNUIMessage({ action: 'action_name', payload: ... })`

This message is captured by a global event listener in the `NuiService`.

**Example (Client Script):**
```javascript
// When the phone is opened
SendNUIMessage({ action: 'openPhone' });
```

**Example (Angular NUI Service):**
```typescript
// In nui.service.ts constructor
window.addEventListener('message', (event) => {
  if (event.data && event.data.action) {
    this.messageSubject.next(event.data);
  }
});

// Any other service can then subscribe to the NuiService.messages$ observable
// to react to specific actions.
```
