import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Percolator } from '../../providers/percolator/percolator';
import { OneSignal } from '@ionic-native/onesignal';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the SavedSearchesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-saved-searches',
  templateUrl: 'saved-searches.html',
})
export class SavedSearchesPage {

  private query: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private percolator: Percolator, 
  	private oneSignal: OneSignal, private afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SavedSearchesPage');
  }

  saveQuery() {
  	this.oneSignal.getIds().then(ids => { 
    	let oneId = ids['userId'];   
    	let email = this.afAuth.auth.currentUser.email;
    	this.percolator.saveSearch(email, oneId, this.query).subscribe(data => {
        alert('done');
      });
    });
  }
}
