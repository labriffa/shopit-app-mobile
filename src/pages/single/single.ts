import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ShopitCoordinates } from '../../providers/shopit-coordinates/shopit-coordinates';
import { Shopit } from '../../providers/shopit/shopit';

@IonicPage()
@Component({
  selector: 'page-single',
  templateUrl: 'single.html',
})
export class SinglePage {

  private title: string;
  private product: any;
  private stores: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private shopitCoordinates: ShopitCoordinates, private shopit: Shopit) {
  	this.product = navParams.get("product");
  	this.title = this.product._source.title;
  	this.findClosestStore();
  }

  findClosestStore() {
  	this.shopit.searchBusinesses(this.shopitCoordinates.getLat(), this.shopitCoordinates.getLng(), this.product.name)
    	.subscribe(data => {
        console.log(data);
        	this.stores = data ? data : [];
    });
  }

  ionViewDidLoad() { }
}
