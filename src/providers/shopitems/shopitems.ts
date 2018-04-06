import { Injectable } from '@angular/core';

@Injectable()
export class ShopitItems {

	private items: any[];

	constructor() { 
		this.items = [];
	}

	set(items) {
		this.items = items;
	}

	get() {
		return this.items;
	}
}
