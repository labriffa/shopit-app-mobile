import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map'

@Injectable()
export class Percolator {

	readonly API_ENDPOINT = 'http://ec2-35-178-130-149.eu-west-2.compute.amazonaws.com:9000/api';
	readonly API_SAVE_SEARCHES = '/save-searches';

	constructor(public http: HttpClient) { }

	/**
	*  Gets the closest businesses to the users' current area based on
    *  a given search term
	*/
	saveSearch(userId, playerId, query) {
		alert(this.API_ENDPOINT + "" + this.API_SAVE_SEARCHES);
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
