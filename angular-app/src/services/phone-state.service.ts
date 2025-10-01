import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Contact, Message, App, Conversation, Call, Wallpaper } from '../models/phone.models';
import { NexaStoreService } from './nexa-store.service';
import { NuiService } from './nui.service';
import { filter } from 'rxjs/operators';

// MOCK DATA
const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Ava', number: '555-0101', avatar: 'https://i.pravatar.cc/150?u=ava', favorite: true },
  { id: '2', name: 'Liam', number: '555-0102', avatar: 'https://i.pravatar.cc/150?u=liam', favorite: true },
  { id: '3', name: 'Mechanic', number: '555-0199', avatar: 'https://i.pravatar.cc/150?u=mech' },
  { id: '4', name: 'Dr. Smith', number: '555-0104', avatar: 'https://i.pravatar.cc/150?u=drsmith' },
  { id: '5', name: 'Police Department', number: '911' },
];

const MOCK_MESSAGES: Message[] = [
  { id: 'm1', from: '555-0101', to: '123-4567', text: 'Hey, are you free tonight?', timestamp: Date.now() - 1000 * 60 * 5, read: true, isSender: false },
  { id: 'm2', from: '123-4567', to: '555-0101', text: 'Yeah, what\'s up?', timestamp: Date.now() - 1000 * 60 * 4, read: true, isSender: true },
  { id: 'm3', from: '555-0102', to: '123-4567', text: 'Got the stuff ready for the job.', timestamp: Date.now() - 1000 * 60 * 60, read: false, isSender: false },
];

const MOCK_GRID_APPS: App[] = [
    { id: 'contacts', name: 'Contacts', icon: 'contacts', component: 'contacts', page: 0, category: 'Social', version: '1.0.0' },
    { id: 'camera', name: 'Camera', icon: 'camera', component: 'camera', page: 0, category: 'Utilities', version: '1.2.0' },
    { id: 'mail', name: 'Mail', icon: 'mail', component: 'home', page: 0, category: 'Productivity', version: '1.0.0' },
    { id: 'photos', name: 'Photos', icon: 'photos', component: 'home', page: 0, category: 'Utilities', version: '1.0.0' },
    { id: 'clock', name: 'Clock', icon: 'clock', component: 'home', page: 0, category: 'Utilities', version: '1.0.0' },
    { id: 'nexa-store', name: 'NexaStore', icon: 'nexa-store', component: 'nexa-store', page: 0, category: 'Utilities', version: '1.0.0' },
    { id: 'stocks', name: 'Stocks', icon: 'stocks', component: 'home', page: 1, category: 'Finance', version: '1.0.0' },
    { id: 'weather', name: 'Weather', icon: 'weather', component: 'home', page: 1, category: 'Utilities', version: '1.0.0' },
    { id: 'app-library', name: 'App Library', icon: 'app-library', component: 'app-library', page: 1, category: 'Utilities' },
];

const MOCK_DOCK_APPS: App[] = [
    { id: 'dialer', name: 'Phone', icon: 'phone', component: 'dialer', category: 'Social', version: '1.1.0' },
    { id: 'sms', name: 'Messages', icon: 'sms', component: 'sms', category: 'Social', version: '1.3.0' },
    { id: 'gps', name: 'GPS', icon: 'gps', component: 'gps', category: 'Utilities', version: '3.0.0' },
    { id: 'settings', name: 'Settings', icon: 'settings', component: 'settings', category: 'Utilities', version: '1.0.0' },
];

const MOCK_WALLPAPERS: Wallpaper[] = [
    { id: 'w1', name: 'City Blur', url: 'https://picsum.photos/360/780?blur=2' },
    { id: 'w2', name: 'Mountains', url: 'https://picsum.photos/seed/mountains/360/780' },
    { id: 'w3', name: 'Abstract', url: 'https://picsum.photos/seed/abstract/360/780' },
    { id: 'w4', name: 'Ocean', url: 'https://picsum.photos/seed/ocean/360/780' },
];

const MY_PHONE_NUMBER = '123-4567';

@Injectable({ providedIn: 'root' })
export class PhoneStateService {
  private nexaStoreService = inject(NexaStoreService);
  private nuiService = inject(NuiService);

  // === CORE STATE ===
  isPhoneVisible = signal(false); // Default to false for FiveM
  isFirstTimeSetupComplete = signal(false);
  myPhoneNumber = signal(MY_PHONE_NUMBER);
  
  // === APP NAVIGATION ===
  // History stack for back navigation. 'home' is the root.
  viewStack = signal<string[]>(['home']);
  currentView = computed(() => this.viewStack()[this.viewStack().length - 1]);
  
  // === HOME SCREEN ===
  gridApps = signal<App[]>(MOCK_GRID_APPS);
  dockApps = signal<App[]>(MOCK_DOCK_APPS);
  allApps = computed<App[]>(() => {
    const all = [...this.gridApps(), ...this.dockApps()];
    // Remove duplicates by id and sort alphabetically
    const uniqueApps = Array.from(new Map(all.map(app => [app.id, app])).values());
    return uniqueApps.sort((a, b) => a.name.localeCompare(b.name));
  });
  homeScreenPages = computed(() => {
      const pages: App[][] = [];
      this.gridApps().forEach(app => {
          const pageIndex = app.page ?? 0;
          if (!pages[pageIndex]) {
              pages[pageIndex] = [];
          }
          pages[pageIndex].push(app);
      });
      return pages;
  });
  homeScreenPageIndex = signal(0);
  isJiggleModeActive = signal(false);

  // === CONTACTS APP ===
  contacts = signal<Contact[]>(MOCK_CONTACTS);
  
  // === MESSAGES APP ===
  messages = signal<Message[]>(MOCK_MESSAGES);
  conversations = computed<Conversation[]>(() => {
    const convos = new Map<string, Message>();
    this.messages().forEach(msg => {
        const otherPartyNumber = msg.from === this.myPhoneNumber() ? msg.to : msg.from;
        const existing = convos.get(otherPartyNumber);
        if (!existing || msg.timestamp > existing.timestamp) {
            convos.set(otherPartyNumber, msg);
        }
    });
    return Array.from(convos.values()).map(lastMessage => {
        const otherPartyNumber = lastMessage.from === this.myPhoneNumber() ? lastMessage.to : lastMessage.from;
        const contact = this.contacts().find(c => c.number === otherPartyNumber) ?? { id: otherPartyNumber, name: otherPartyNumber, number: otherPartyNumber };
        return { contact, lastMessage };
    }).sort((a,b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
  });
  selectedConversationContact = signal<Contact | null>(null);

  // === CALLING APP ===
  activeCall = signal<Call | null>(null);
  
  // === SETTINGS APP ===
  wallpapers = signal<Wallpaper[]>(MOCK_WALLPAPERS);
  theme = signal<'light' | 'dark'>('dark');
  
  // === UI STATE ===
  isLocked = signal(true); // Phone starts locked
  isControlCenterVisible = signal(false);
  volume = signal(50); // Volume from 0 to 100
  isSilent = signal(false);

  // === GENERAL ===
  wallpaperUrl = signal(MOCK_WALLPAPERS[0].url);

  constructor() {
    // Effect to automatically post a 'closePhone' message when visibility is set to false.
    effect(() => {
        if (!this.isPhoneVisible()) {
            this.nuiService.closePhone();
        }
    });

    // Listen for incoming messages from the NUI service.
    this.nuiService.messages$
      .pipe(filter((message) => message.action === 'receiveMessage'))
      .subscribe((message) => {
        const { from, text } = message.payload;
        this.receiveMessage(from, text);
      });

    // Sync initial app statuses with the NexaStore
    this.syncInitialAppStatuses();
  }

  private syncInitialAppStatuses() {
    const installedApps = [...this.gridApps(), ...this.dockApps()];
    installedApps.forEach(app => {
        this.nexaStoreService.setAppStatus(app.id, 'installed');
    });
  }

  // === ACTIONS ===
  togglePhoneVisibility(visible: boolean) {
    this.isPhoneVisible.set(visible);
    if (visible) {
        // When phone becomes visible, ensure it's on the lock screen.
        this.isLocked.set(true);
    } else {
      // Also lock and hide overlays when screen turns off
      this.isLocked.set(true);
      this.isControlCenterVisible.set(false);
      this.goHome(); // Reset view stack
    }
  }

  completeFirstTimeSetup() {
    this.isFirstTimeSetupComplete.set(true);
    this.unlockPhone(); // Go directly to home screen after setup
  }

  navigate(view: string) {
    this.isJiggleModeActive.set(false);
    this.viewStack.update(stack => [...stack, view]);
  }

  navigateBack() {
    this.viewStack.update(stack => {
      if (stack.length > 1) {
        return stack.slice(0, -1);
      }
      return stack; // Cannot go back further than home
    });
  }

  goHome() {
    this.isJiggleModeActive.set(false);
    this.viewStack.set(['home']);
    this.selectedConversationContact.set(null);
  }

  selectConversation(contact: Contact) {
    this.selectedConversationContact.set(contact);
    this.navigate('chat');
  }
  
  sendMessage(to: string, text: string) {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      from: this.myPhoneNumber(),
      to,
      text,
      timestamp: Date.now(),
      read: true,
      isSender: true,
    };
    this.messages.update(messages => [...messages, newMessage]);
    this.nuiService.sendMessage(to, text);
  }

  // Simulates receiving a message
  receiveMessage(from: string, text: string) {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      from,
      to: this.myPhoneNumber(),
      text,
      timestamp: Date.now(),
      read: false,
      isSender: false,
    };
    this.messages.update(messages => [...messages, newMessage]);
    // TODO: show notification
  }
  
  startCall(contact: Contact) {
    if(this.activeCall()) return;
    const newCall: Call = {
      id: `c${Date.now()}`,
      contact,
      status: 'outgoing',
      duration: 0,
    };
    this.activeCall.set(newCall);
    this.navigate('call');
    this.nuiService.startCall(contact.number);
  }
  
  endCall() {
    this.activeCall.set(null);
    this.navigateBack();
  }
  
  setWallpaper(url: string) {
    this.wallpaperUrl.set(url);
  }
  
  setTheme(theme: 'light' | 'dark') {
    this.theme.set(theme);
  }

  adjustVolume(amount: number) {
    this.volume.update(v => {
        const newVolume = Math.max(0, Math.min(100, v + amount));
        // If volume is turned up, disable silent mode.
        if (newVolume > 0) {
            this.isSilent.set(false);
        }
        return newVolume;
    });
  }

  toggleSilentMode() {
    this.isSilent.update(s => !s);
  }

  toggleControlCenter(visible?: boolean) {
    if (typeof visible === 'boolean') {
      this.isControlCenterVisible.set(visible);
    } else {
      this.isControlCenterVisible.update(v => !v);
    }
  }

  unlockPhone() {
    this.isLocked.set(false);
  }

  lockPhone() {
    this.isLocked.set(true);
  }

  setHomeScreenPage(index: number) {
    const pageCount = this.homeScreenPages().length;
    if (index >= 0 && index < pageCount) {
        this.homeScreenPageIndex.set(index);
    }
  }

  toggleJiggleMode(active: boolean) {
    this.isJiggleModeActive.set(active);
  }
  
  installApp(app: App) {
    // Avoid duplicates
    if (this.gridApps().some(a => a.id === app.id)) return;
    
    // Find the first page with an empty slot, or create a new page
    const pages = this.homeScreenPages();
    let targetPage = pages.findIndex(p => p.length < 16); // Max 16 apps per page (4x4)
    if (targetPage === -1) {
        targetPage = pages.length;
    }

    const appToInstall: App = {...app, page: targetPage};
    this.gridApps.update(apps => [...apps, appToInstall]);
    this.nexaStoreService.setAppStatus(app.id, 'installed');
  }

  uninstallApp(appId: string) {
    this.gridApps.update(apps => apps.filter(a => a.id !== appId));
    this.nexaStoreService.setAppStatus(appId, 'not_installed');
  }

  addContact(newContact: Contact) {
    this.contacts.update(existingContacts => {
      // Check if contact with the same number already exists
      const contactExists = existingContacts.some(c => c.number === newContact.number);
      if (contactExists) {
        // Optionally, update the existing contact here
        return existingContacts;
      }
      return [...existingContacts, newContact];
    });
  }
}
