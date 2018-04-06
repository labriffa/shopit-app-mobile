import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { SavedSearchesPage } from '../pages/saved-searches/saved-searches';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  @ViewChild(Nav) nav: Nav;

  pages: Array<{ title: string, component: any }>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      let notitifcationOpenedCallback = function(jsonData) {
        alert('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };

      // window["plugins"].OneSignal
      //   .startInit('cb327133-55fa-4315-ab1c-59e5a2ebe064', '631149709966')
      //   .handleNotificationOpened(notitifcationOpenedCallback)
      //   .endInit();

      // this.pages = [
      //   { title: "Home", component: HomePage },
      //   { title: "Login", component: LoginPage },
      //   { title: "Register", component: RegisterPage },
      //   { title: "Saved Searches", component: SavedSearchesPage }
      // ];
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
