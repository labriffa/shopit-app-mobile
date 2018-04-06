import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'distanceToGo'})
export class DistanceToGo implements PipeTransform {
	transform(shopCoordinates: any, userCoordinates: any): string {

		// latitude values
		var lat1:number = this.toRad(shopCoordinates["lat"]);
		var lat2: number = this.toRad(userCoordinates[0]);

		// longitude values
		var lng1: number = this.toRad(shopCoordinates["lon"]);
		var lng2: number = this.toRad(userCoordinates[1]);

		// radius of the earth
		var R: number = 3963.2;

		// haversine formula
		// refer : https://www.movable-type.co.uk/scripts/latlong.html
		var d: number = 2 * R * Math.asin( Math.sqrt( Math.pow(Math.sin( (lat2 - lat1) / 2 ), 2) + 
			Math.cos(lat1) * Math.cos(lat2) * Math.pow( Math.sin( (lng2 - lng1) / 2 ), 2 ) ) 
		);

		var walkingTime: number = d * 15;

		let newStr: string = `${Math.ceil(parseInt(walkingTime.toFixed(1)))} min (${ d.toFixed(2) } miles)`;
		return newStr;
	}

	/*
	* Converts a given value to radians
	*/
	toRad(x) {
		return x * Math.PI / 180;
	}
}