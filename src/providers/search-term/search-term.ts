import { Injectable } from '@angular/core';

@Injectable()
export class SearchTermProvider {

	private input: string;

	constructor() { 
		this.input = "";
	}

	set(input) {
		this.input = input;
	}

	get() {
		return this.input;
	}
}
