import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NavController, LoadingController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Shopit } from '../../providers/shopit/shopit';
import { GoogleVision } from '../../providers/googlevision/googlevision';
import { ShopitCoordinates } from '../../providers/shopit-coordinates/shopit-coordinates';

@Component({
	selector: 'page-products',
	templateUrl: 'products.html'
})
export class ProductsPage {

	private items: any;
	private myInput = '';
	private start;
	private size;
	private newItems: any;
	private base64Image: string;

	constructor(public navCtrl: NavController, private geolocation: Geolocation, private shopitCoordinates: ShopitCoordinates,
		private shopit: Shopit, private camera: Camera, private googlevision: GoogleVision, private loading: LoadingController) {
		this.items = []; 
		this.start = 10;
		this.size = 10;
	}

	itemSelected(item) {
	}

	onInput(event) {

		// if there is no input we don't want to perform a search!
		if(this.myInput != '') {

			// reset the index back to the start
			this.start = 0;

			let cart = document.getElementById("cart") as HTMLElement;
			cart.style.display = 'none';

			// watch for changes in location
			let watch = this.geolocation.watchPosition();
			watch.subscribe((resp) => {
				this.shopitCoordinates.setLat(resp.coords.latitude);
				this.shopitCoordinates.setLng(resp.coords.longitude);
			});

			let loader = this.loading.create({
				content: 'Updating Store Entries...',
				cssClass: 'loadingwrapper'
			});

			// present the loader and make the requests
			loader.present().then(() => {

				// if the user has selecte a polygon area search based off of that
				if(this.shopitCoordinates.getCoordinates() && this.shopitCoordinates.getCoordinates().length > 0) {
					this.shopit.searchProductsPolygon(this.myInput, 0, 9, this.shopitCoordinates.getCoordinates())
					.subscribe(data => { 
						this.items = data ? data : []; 
						loader.dismiss();
					});
				} else {

					// otherwise use their current coordinates
					this.shopit.searchProducts(this.shopitCoordinates.getLat(), this.shopitCoordinates.getLng(), this.myInput, 0, 9)
					.subscribe(data => { 
						this.items = data ? data : []; 
						loader.dismiss();
					});
				}
			});      
		}
	}

	onCancel(event) { }

	doInfinite(infiniteScroll) {
		if(this.items) {
			this.start += 10;

			if(this.shopitCoordinates.getCoordinates() && this.shopitCoordinates.getCoordinates().length > 0) {
				this.shopit.searchProductsPolygon(this.myInput, this.start, this.size, this.shopitCoordinates.getCoordinates())
				.subscribe(data => { 
					this.newItems = data ? data : []; 

					setTimeout(() => {
						this.items = this.items.concat( this.newItems );
						infiniteScroll.complete();
					}, 500);
				});
			} else {
				this.shopit.searchProducts(this.shopitCoordinates.getLat(), this.shopitCoordinates.getLng(), this.myInput, this.start, this.size)
				.subscribe(data => { 
					this.newItems = data ? data : []; 

					setTimeout(() => {
						this.items = this.items.concat( this.newItems );
						infiniteScroll.complete();
					}, 500);
				});
			}
		}
	}

	takePicture() {	
		let options = {
			destinationType: this.camera.DestinationType.DATA_URL,
			targetWidth: 1000,
			targetHeight: 1000,
		}

		this.camera.getPicture(options)
		.then((imageData) => {
			this.base64Image = "data:image/jpg;base64," + imageData;

			this.googlevision.searchImage(imageData).subscribe(data => {
				let bestGuess = data["responses"][0]["webDetection"]["bestGuessLabels"][0].label;
				this.myInput = bestGuess;
				this.shopit.searchProducts(this.shopitCoordinates.getLat(), this.shopitCoordinates.getLng(), this.myInput, 0, 10)
				.subscribe(data => { 
					this.items = data ? data : []; 
					console.log(this.items);
				});
			});
		});
	}
}
