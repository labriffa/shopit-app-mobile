import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Shopit } from '../../providers/shopit/shopit';

@Component({
  selector: 'page-single',
  templateUrl: 'single.html'
})

export class SinglePage {

	private product;
	private items;
	private newItems;
	private lat;
	private lng;
	private start;
	private end;
	private myInput = '';

	constructor(public navCtrl: NavController, public navParams: NavParams, private shopit: Shopit) {
		this.product = navParams.get("product");
		this.lat = navParams.get("lat");
		this.lng = navParams.get("lng");
		this.items = this.product.products;
		this.newItems = [];
		this.start = 10;
		this.end = 20;

		this.init();
	}

	init() {
		this.shopit.searchByBusiness(this.product._id, this.myInput, 0, 10)
			.subscribe(data => { this.items = data ? data : []; });
	}

	goback() {
		this.navCtrl.pop();
	}

	onInput(event) {
		this.start = 0;
		this.end = 10;
		
		this.shopit.searchByBusiness(this.product._id, this.myInput, 0, 10)
			.subscribe(data => { this.items = data ? data : []; });
	}

	doInfinite(infiniteScroll) {

		this.start += 10;
		this.end += 10;

		this.shopit.searchByBusiness(this.product._id, this.myInput, this.start, this.end)
			.subscribe(data => { 
				this.newItems = data ? data : []; 
				
				setTimeout(() => {
					this.items = this.items.concat( this.newItems );
					infiniteScroll.complete();
				}, 500);
			});
  	}
}
