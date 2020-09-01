import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, SHOPIT_API_ENDPOINT } from '../../environments/environment';

import 'rxjs/add/operator/map'

@Injectable()
export class Shopit {

	readonly API_ENDPOINT = SHOPIT_API_ENDPOINT;
	readonly API_SEARCH_BUSINESSES_METHOD = '/businesses';
	readonly API_SEARCH_PRODUCTS_METHOD = '/products';

	constructor(public http: HttpClient) { }

	/**
	*  Gets the closest businesses to the users' current area based on
    *  a given search term
	*/
	searchBusinesses(lat, lng, query="") {
		if(query) {
			return this.http.get(this.API_ENDPOINT + this.API_SEARCH_BUSINESSES_METHOD 
			+ '?lat=' + lat + '&lng=' + lng + '&q=' + query);
		} else {
			return this.http.get(this.API_ENDPOINT + this.API_SEARCH_BUSINESSES_METHOD 
			+ '?lat=' + lat + '&lng=' + lng);
		}
	}

	searchBusinessesPolygon(lat, lng, coordinates, q) {
		return this.http.post(this.API_ENDPOINT + this.API_SEARCH_BUSINESSES_METHOD, {
			q: q,
			coordinates: JSON.stringify(coordinates),
			lat: lat,
			lng: lng
		},
		{
			headers: { 'Content-Type': 'application/json' }
		});
	}

	searchByBusiness(id, q, start, end) {
		return this.http.get(this.API_ENDPOINT + this.API_SEARCH_BUSINESSES_METHOD
			+ '/' + id + '?q=' + q + '&start=' + start + '&end=' + end );
	}

	searchProducts(lat, lng, query, start, end) {
		return this.http.get(this.API_ENDPOINT + this.API_SEARCH_PRODUCTS_METHOD + '?lat=' 
			+ lat + '&lng=' + lng + '&q=' + query + '&start=' + start + '&end=' + end);
	}

	searchProductsPolygon(query, start, end, coordinates) {
		return this.http.post(this.API_ENDPOINT + this.API_SEARCH_PRODUCTS_METHOD, {
			q: query,
			coordinates: JSON.stringify(coordinates),
			start: start,
			end: end
		},
		{
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
