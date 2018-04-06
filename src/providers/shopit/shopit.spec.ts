import { Shopit } from './shopit';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

describe('Shopit', () => {
	let service: Shopit;
	let httpMock: HttpTestingController;

	beforeEach(() => {
	    TestBed.configureTestingModule({
	      imports: [HttpClientTestingModule],
	      providers: [Shopit]
	    });

	    service = TestBed.get(Shopit);
	    httpMock = TestBed.get(HttpTestingController);
  	});

  	describe('#getBusinesses', () => {
  		it('should get the data successful', () => {
		    service.searchBusinesses(53,-2).subscribe((data: any) => {
		      expect(data.name).toBe('Argos');
		    });

		    const req = httpMock.expectOne(`${service.API_ENDPOINT}${service.API_SEARCH_BUSINESSES_METHOD}?lat=53&lng=-2`, 'call to api');
		    expect(req.request.method).toBe('GET');

		    req.flush({
		      name: 'Argos'
		    });

		    httpMock.verify();
		});
  	});
});