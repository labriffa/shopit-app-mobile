import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { OneSignal } from '@ionic-native/onesignal';

import { FixedPipe } from '../pipes/fixed.pipe';
import { DistanceToGo } from '../pipes/distance-to-go.pipe';

import { ProductsPage } from '../pages/products/products';
import { StoresPage } from '../pages/stores/stores';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Shopit } from '../providers/shopit/shopit';
import { ShopitItems } from '../providers/shopitems/shopitems';
import { ShopitCoordinates } from '../providers/shopit-coordinates/shopit-coordinates';
import { GoogleVision } from '../providers/googlevision/googlevision';
import { Percolator } from '../providers/percolator/percolator';

import { FIREBASE_CONFIG } from './app.firebase.config';
import { SearchTermProvider } from '../providers/search-term/search-term';

@NgModule({
  declarations: [
    MyApp,
    ProductsPage,
    StoresPage,
    HomePage,
    TabsPage,
    DistanceToGo,
    FixedPipe   
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom',
    }),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    HttpClientModule,
    HttpModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProductsPage,
    StoresPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    Shopit,
    ShopitItems,
    ShopitCoordinates,
    HttpClientModule,
    HttpModule,
    OneSignal,
    Camera,
    GoogleVision,
    Percolator,
    SearchTermProvider
  ]
})
export class AppModule {}
