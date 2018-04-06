import { Injectable } from '@angular/core';

@Injectable()
export class ShopitCoordinates {

	private lat: number;
	private lng: number;
	private coordinates: any;

	constructor() { 
		this.lat = 0;
		this.lng = 0;
		this.coordinates = [];
	}

	setLat(lat) {
		this.lat = lat;
	}

	getLat() {
		return this.lat;
	}

	setLng(lng) {
		this.lng = lng;
	}

	getLng() {
		return this.lng;
	}

	setCoordinates(coordinates) {
		this.coordinates = coordinates;
	}

	getCoordinates() {
		return this.coordinates;
	}
}
