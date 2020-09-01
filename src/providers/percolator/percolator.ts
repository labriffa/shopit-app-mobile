import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, SHOPIT_API_ENDPOINT } from '../../environments/environment';

import 'rxjs/add/operator/map'

@Injectable()
export class Percolator {

	readonly API_ENDPOINT = SHOPIT_API_ENDPOINT;
	readonly API_SAVE_SEARCHES = '/save-searches';

	constructor(public http: HttpClient) { }

	/**
	*  Gets the closest businesses to the users' current area based on
    *  a given search term
	*/
	saveSearch(userId, playerId, query) {
		return this.http.post(this.API_ENDPOINT + this.API_SAVE_SEARCHES, {
			userId: userId,
			playerId: playerId,
			query: query
		},
		{
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
