import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, GOOGLE_VISION_API_KEY } from '../../environments/environment';

import 'rxjs/add/operator/map'

@Injectable()
export class GoogleVision {

	readonly API_ENDPOINT = GOOGLE_VISION_API_KEY;

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
