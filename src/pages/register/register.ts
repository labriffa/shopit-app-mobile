import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth) {
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  async register(user: User) {
  	try {
  		const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email.trim(), user.password);
  	} catch(e) {
  		console.error(e);
  	}
  }
}
