import { Injectable, signal, computed, effect, WritableSignal } from '@angular/core';
import { App } from '../models/phone.models';

export interface StoreApp extends App {
    shortDescription: string;
    longDescription: string;
    developer: string;
    category: string;
    screenshots: string[];
    rating: number;
    reviewCount: number;
    releaseNotes: string;
}

export interface FeaturedBanner {
    id: string;
    appId: string;
    tagline: string;
    title: string;
    imageUrl: string;
}

export type AppStatus = 'not_installed' | 'installing' | 'installed' | 'updating';

// MOCK DATA for the App Store repository
const MOCK_APP_REPOSITORY: StoreApp[] = [
    {
        id: 'flowpay',
        name: 'FlowPay',
        icon: 'flowpay',
        component: 'flowpay',
        version: '1.1.0',
        shortDescription: 'Modern, secure banking.',
        longDescription: 'Manage your finances with FlowPay, the leading digital bank in Los Santos. Securely check your balance, send money to friends with a tap, and track your spending with a detailed transaction history. Integrated with NexaAir for easy peer-to-peer payments.',
        developer: 'FlowPay Financial',
        category: 'Finance',
        screenshots: ['https://picsum.photos/seed/fp1/200/350', 'https://picsum.photos/seed/fp2/200/350'],
        rating: 4.9,
        reviewCount: 8500,
        releaseNotes: 'Initial release with NexaAir integration.'
    },
    {
        id: 'z-app',
        name: 'Z',
        icon: 'z-app',
        component: 'z-app',
        version: '1.0.2',
        shortDescription: 'The pulse of Los Santos.',
        longDescription: 'Join the conversation on Z. Share your thoughts, break the news, and see what\'s happening across the city in real-time. Follow your friends, rivals, and favorite personalities.',
        developer: 'Z Corporation',
        category: 'Social',
        screenshots: ['https://picsum.photos/seed/z1/200/350', 'https://picsum.photos/seed/z2/200/350', 'https://picsum.photos/seed/z3/200/350'],
        rating: 4.5,
        reviewCount: 11200,
        releaseNotes: 'Performance improvements and a smoother feed.'
    },
    {
        id: 'pixi-app',
        name: 'Pixi',
        icon: 'pixi',
        component: 'pixi-app',
        version: '1.2.0',
        shortDescription: 'Share your moments.',
        longDescription: 'Capture and share your life\'s moments with Pixi. Post photos, share stories, and discover the visual side of Los Santos. Follow creators and see the city through their eyes.',
        developer: 'Pixi Inc.',
        category: 'Social',
        screenshots: ['https://picsum.photos/seed/px1/200/350', 'https://picsum.photos/seed/px2/200/350'],
        rating: 4.7,
        reviewCount: 15300,
        releaseNotes: 'New filters and story enhancements.'
    },
    {
        id: 'lifinvader',
        name: 'Lifinvader',
        icon: 'lifinvader',
        component: 'lifinvader',
        version: '1.0.0',
        shortDescription: 'Connect with friends.',
        longDescription: 'The premier social network of Los Santos. Share updates, connect with friends, and stalk your old high school classmates. Now with less data harvesting!',
        developer: 'Lifinvader Inc.',
        category: 'Social',
        screenshots: ['https://picsum.photos/seed/li1/200/350', 'https://picsum.photos/seed/li2/200/350', 'https://picsum.photos/seed/li3/200/350'],
        rating: 4.1,
        reviewCount: 1200,
        releaseNotes: 'Initial release. Bug fixes and performance improvements.'
    },
    {
        id: 'bleeter',
        name: 'Bleeter',
        icon: 'bleeter',
        component: 'bleeter',
        version: '2.3.1',
        shortDescription: 'What\'s happening?',
        longDescription: 'Bleet your thoughts to the world in 140 characters or less. Follow celebrities, politicians, and your favorite Vinewood stars. The official sound of a city in decline.',
        developer: 'Bleeter',
        category: 'Social',
        screenshots: ['https://picsum.photos/seed/bl1/200/350', 'https://picsum.photos/seed/bl2/200/350'],
        rating: 3.8,
        reviewCount: 980,
        releaseNotes: 'Increased character limit... just kidding.'
    },
    {
        id: 'dynasty8',
        name: 'Dynasty 8',
        icon: 'dynasty8',
        component: 'dynasty8',
        version: '1.5.0',
        shortDescription: 'Your new home awaits.',
        longDescription: 'Browse the finest properties in San Andreas. From downtown penthouses to Blaine County shacks, find your perfect home or business with Dynasty 8 Real Estate.',
        developer: 'Dynasty 8',
        category: 'Finance',
        screenshots: ['https://picsum.photos/seed/d1/200/350', 'https://picsum.photos/seed/d2/200/350', 'https://picsum.photos/seed/d3/200/350'],
        rating: 4.8,
        reviewCount: 2500,
        releaseNotes: 'Added new filter for "within helicopter distance of a bank".'
    }
];

const MOCK_FEATURED_BANNERS: FeaturedBanner[] = [
    { id: 'f1', appId: 'dynasty8', tagline: 'GET REAL ESTATE', title: 'Find Your Dream Property', imageUrl: 'https://picsum.photos/seed/feat1/400/250'},
    { id: 'f2', appId: 'lifinvader', tagline: 'SOCIAL', title: 'Stay Connected', imageUrl: 'https://picsum.photos/seed/feat2/400/250'},
];


@Injectable({ providedIn: 'root' })
export class NexaStoreService {
    // A map to hold the status of each app.
    appStatuses: WritableSignal<Map<string, AppStatus>> = signal(new Map());

    // The master list of all apps available for download.
    availableApps = signal<StoreApp[]>(MOCK_APP_REPOSITORY);
    
    // Featured content for the "Today" page.
    featuredBanners = signal<FeaturedBanner[]>(MOCK_FEATURED_BANNERS);

    // The app currently being viewed in the details page.
    selectedApp = signal<StoreApp | null>(null);

    constructor() {
        // Initialize statuses for all available apps to 'not_installed'.
        // The phoneStateService will then sync the actual installed apps.
        this.appStatuses.update(statuses => {
            MOCK_APP_REPOSITORY.forEach(app => {
                statuses.set(app.id, 'not_installed');
            });
            return statuses;
        });
    }

    /**
     * Sets the status for a specific app.
     */
    setAppStatus(appId: string, status: AppStatus) {
        this.appStatuses.update(statuses => {
            statuses.set(appId, status);
            return new Map(statuses); // Return new map to trigger change detection
        });
    }

    /**
     * Gets the status of a specific app.
     */
    getAppStatus(appId: string): AppStatus {
        return this.appStatuses().get(appId) || 'not_installed';
    }

    /**
     * Selects an app to be viewed in the details page.
     */
    selectAppForDetails(appId: string | null) {
        if (!appId) {
            this.selectedApp.set(null);
            return;
        }
        const app = this.availableApps().find(a => a.id === appId);
        this.selectedApp.set(app || null);
    }
}