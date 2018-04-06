import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ShopitItems } from '../../providers/shopitems/shopitems';
import { ShopitCoordinates } from '../../providers/shopit-coordinates/shopit-coordinates';
import { Shopit } from '../../providers/shopit/shopit';

@Component({
	selector: 'page-stores',
	templateUrl: 'stores.html'
})
export class StoresPage {

	private items;
	private myInput;

	constructor(public navCtrl: NavController, public events: Events, private shopit: Shopit, 
        private shopitems: ShopitItems, private loading: LoadingController, private shopitcoordinates: ShopitCoordinates) {  }

	ionViewWillEnter() {
		this.items = this.shopitems.get();
	}

    itemSelected(item) {
        this.navCtrl.push('LoginPage');
    }

  	 /**
     * Updates the list of shown businesses based on the users' search query
     **/
     onInput(event) { 

     	let loader = this.loading.create({
     		content: 'Updating Store Entries...',
     		cssClass: 'loadingwrapper'
     	});

     	loader.present().then(() => {

            const coordinates = this.shopitcoordinates.getCoordinates();

            if(coordinates && coordinates.length > 0) {
                this.shopit.searchBusinessesPolygon(this.shopitcoordinates.getLat(), this.shopitcoordinates.getLng(), coordinates, this.myInput).subscribe(data => {
                        this.items = data ? data : [];
                        loader.dismiss();
                });
            } else {
                this.shopit.searchBusinesses(this.shopitcoordinates.getLat(), this.shopitcoordinates.getLng(), this.myInput)
                    .subscribe(data => {
                        this.items = data ? data : [];
                        loader.dismiss();
                });
            }
        });    
     }

     onCancel(event) {}
 }
