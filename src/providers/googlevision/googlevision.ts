import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map'

@Injectable()
export class GoogleVision {

	readonly API_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDVyFqzbBNaY43EThMkJN5lrsEaFDqj3XU';

	constructor(public http: HttpClient) { }

	searchImage(base64Image) {

		const body = {
	      "requests": [
	        {
	          "image": {
	            "content": base64Image
	          },
	          "features": [
	            {
	              "type": "WEB_DETECTION"
	            }
	          ]
	        }
	      ]
	    }

		return this.http.post(this.API_ENDPOINT, body);
	}
}
