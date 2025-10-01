import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneStateService } from '../../services/phone-state.service';
import { AirdropService } from '../../services/airdrop.service';
import { StatusBarComponent } from '../status-bar/status-bar.component';
import { HomeScreenComponent } from '../home-screen/home-screen.component';
import { ContactsAppComponent } from '../contacts-app/contacts-app.component';
import { SmsAppComponent } from '../sms-app/sms-app.component';
import { ChatViewComponent } from '../chat-view/chat-view.component';
import { DialerAppComponent } from '../dialer-app/dialer-app.component';
import { CallScreenComponent } from '../call-screen/call-screen.component';
import { SettingsAppComponent } from '../settings-app/settings-app.component';
import { FlowpayAppComponent } from '../flowpay-app/flowpay-app.component';
import { CameraAppComponent } from '../camera-app/camera-app.component';
import { GpsAppComponent } from '../gps-app/gps-app.component';
import { WelcomeWizardComponent } from '../welcome-wizard/welcome-wizard.component';
import { WallpaperSettingsComponent } from '../wallpaper-settings/wallpaper-settings.component';
import { ControlCenterComponent } from '../control-center/control-center.component';
import { LockScreenComponent } from '../lock-screen/lock-screen.component';
import { AppLibraryComponent } from '../app-library/app-library.component';
import { NexaStoreAppComponent } from '../nexa-store-app/nexa-store-app.component';
import { LifinvaderAppComponent } from '../lifinvader-app/lifinvader-app.component';
import { BleeterAppComponent } from '../bleeter-app/bleeter-app.component';
import { Dynasty8AppComponent } from '../dynasty8-app/dynasty8-app.component';
import { ZAppComponent } from '../z-app/z-app.component';
import { PixiAppComponent } from '../pixi-app/pixi-app.component';
import { AirdropSendComponent } from '../airdrop-send/airdrop-send.component';
import { AirdropReceiveComponent } from '../airdrop-receive/airdrop-receive.component';


@Component({
  selector: 'app-phone-shell',
  imports: [
    CommonModule,
    StatusBarComponent,
    HomeScreenComponent,
    ContactsAppComponent,
    SmsAppComponent,
    ChatViewComponent,
    DialerAppComponent,
    CallScreenComponent,
    SettingsAppComponent,
    FlowpayAppComponent,
    CameraAppComponent,
    GpsAppComponent,
    WelcomeWizardComponent,
    WallpaperSettingsComponent,
    ControlCenterComponent,
    LockScreenComponent,
    AppLibraryComponent,
    NexaStoreAppComponent,
    LifinvaderAppComponent,
    BleeterAppComponent,
    Dynasty8AppComponent,
    ZAppComponent,
    PixiAppComponent,
    AirdropSendComponent,
    AirdropReceiveComponent,
  ],
  templateUrl: './phone-shell.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneShellComponent {
  phoneState = inject(PhoneStateService);
  airdropService = inject(AirdropService);

  goHome() {
    this.phoneState.goHome();
  }

  completeSetup() {
    this.phoneState.completeFirstTimeSetup();
  }

  unlockPhone() {
    this.phoneState.unlockPhone();
  }

  toggleControlCenter() {
    this.phoneState.toggleControlCenter();
  }
}
