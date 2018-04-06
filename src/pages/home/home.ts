import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SinglePage } from '../single/single';
import { Shopit } from '../../providers/shopit/shopit';
import { ShopitItems } from '../../providers/shopitems/shopitems';
import { ShopitCoordinates } from '../../providers/shopit-coordinates/shopit-coordinates';
import { Events, Platform } from 'ionic-angular';

import 'rxjs/add/operator/map'

declare var google: any;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	items: any;
	myInput = '';
	@ViewChild('map') mapElement: ElementRef;
	markerCluster: any;
	map: any;
	mapMarkers: any[] = [];
	overlays: any[] = [];
	polys: any[] = [];

	constructor(public navCtrl: NavController, private loading: LoadingController,
		private geolocation: Geolocation, public platform: Platform,
		private shopit: Shopit, public events: Events, private shopitems: ShopitItems, private shopitcoordinates: ShopitCoordinates) {
		this.initializeItems();
        console.log('why :(');
	}

    /**
     * Loads the businesses according to the user's current location
     **/
     initializeItems() {
        // development values
        if (this.platform.is('core') || this.platform.is('mobileweb')) {
            this.shopitcoordinates.setLat(53.494542);
            this.shopitcoordinates.setLng(-2.271309);
            this.searchBusinesses();
        } else {
            // retrieve the users' current position
            this.geolocation.getCurrentPosition().then((resp) => {
                const lat = resp.coords.latitude;
                const lng = resp.coords.longitude;

                this.shopitcoordinates.setLat(lat);
                this.shopitcoordinates.setLng(lng);

                this.searchBusinesses();

            }).catch((error) => {
                console.log('Error getting location', error);
            });
        }        
    }

    updateStoreBadge() {
    	this.events.publish('storeBadge:update', this.items.length);
    }

    updateStoreList() {
    	this.events.publish('storeList:update', this.items);
    }

    /**
     * Passes the current business to the business single page
     **/
     itemSelected(item) {
     	this.navCtrl.push(SinglePage, {
     		business: item
     	});
     }

    /**
     * Updates the list of shown businesses based on the users' search query
     **/
     onInput(event) {

     	let watch = this.geolocation.watchPosition();
     	watch.subscribe((data) => {
     		console.log(data);
     	});

     	this.shopit.searchBusinesses(this.shopitcoordinates.getLat(), this.shopitcoordinates.getLng(), this.myInput)
     	.subscribe(data => {
     		this.items = data ? data : [];
     	});
     }

     onCancel(event) {}

    /**
     * Loads the map when this view has loaded
     **/
     ionViewDidLoad() {
     	this.loadMap();
     }

    /**
     * Intializes the map, setting styles and applies the drawing manager for polygon searching
     **/
     loadMap(){
        // development values
        if(this.platform.is('core') || this.platform.is('mobileweb')) {
            let latLng = new google.maps.LatLng(this.shopitcoordinates.getLat(), this.shopitcoordinates.getLng());
            let mapOptions = {
                center: latLng,
                zoom: 13,
                streetViewControl: false,
                mapTypeControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                gestureHandling: 'greedy',
                styles: [
                {
                    "featureType": "administrative",
                    "elementType": "geometry", 
                    "stylers": [
                    {
                        "visibility": "off"
                    }
                    ]
                },
                {
                    "featureType": "poi",
                    "stylers": [
                    {
                        "visibility": "off"
                    }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                    {
                        "visibility": "off"
                    }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [
                    {
                        "visibility": "off"
                    }
                    ]
                }
                ]
            }

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


            document.querySelector("#drawpoly a").addEventListener("click", (event) => {
                event.preventDefault();

                this.disable();

                document.querySelector("#drawpoly").className = "active";
                document.querySelector("#stopDrawing").className = "display";

                google.maps.event.addDomListener(this.map.getDiv(),'touchstart', (e) => {
                    this.drawFreeHand()
                });

                google.maps.event.addDomListener(this.map.getDiv(),'mousedown', (e) => {
                    this.drawFreeHand()
                });
            });


            document.querySelector("#stopDrawing a").addEventListener("click", (event) => {
                event.preventDefault();

                for(var i = 0; i < this.polys.length; i++) {
                    this.polys[i].setMap(null);
                }

                document.querySelector("#stopDrawing").className = "display-none";
                document.querySelector("#drawpoly").className = "inactive";

                this.searchBusinesses();
                this.shopitcoordinates.setCoordinates([]);
                this.enable();
            });

            let marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: this.map.getCenter()
            });

            let content = "<h4>You are Here!</h4>";         

            this.addInfoWindow(marker, content);

        } else {
            this.geolocation.getCurrentPosition().then((position) => {

            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            let mapOptions = {
                center: latLng,
                zoom: 13,
                streetViewControl: false,
                mapTypeControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                gestureHandling: 'greedy',
                styles: [
                {
                    "featureType": "administrative",
                    "elementType": "geometry", 
                    "stylers": [
                    {
                        "visibility": "off"
                    }
                    ]
                },
                {
                    "featureType": "poi",
                    "stylers": [
                    {
                        "visibility": "off"
                    }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                    {
                        "visibility": "off"
                    }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [
                    {
                        "visibility": "off"
                    }
                    ]
                }
                ]
            }

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


            document.querySelector("#drawpoly a").addEventListener("click", (event) => {
                event.preventDefault();

                this.disable();

                document.querySelector("#drawpoly").className = "active";
                document.querySelector("#stopDrawing").className = "display";

                google.maps.event.addDomListener(this.map.getDiv(),'touchstart', (e) => {
                    this.drawFreeHand()
                });

                google.maps.event.addDomListener(this.map.getDiv(),'mousedown', (e) => {
                    this.drawFreeHand()
                });
            });


            document.querySelector("#stopDrawing a").addEventListener("click", (event) => {
                event.preventDefault();

                for(var i = 0; i < this.polys.length; i++) {
                    this.polys[i].setMap(null);
                }

                document.querySelector("#stopDrawing").className = "display-none";
                document.querySelector("#drawpoly").className = "inactive";

                this.searchBusinesses();
                this.shopitcoordinates.setCoordinates([]);
                this.enable();
            });

            let marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: this.map.getCenter()
            });

            let content = "<h4>You are Here!</h4>";         

            this.addInfoWindow(marker, content);

            }, (err) => {
                console.log(err);
            });
        }
     }

     searchBusinesses() {

     	this.removeMarkers();

     	let loader = this.loading.create({
     		content: 'Updating Store Entries...',
     		cssClass: 'loadingwrapper'
     	});

        // update the list of businesses according to the list of coordinates
        loader.present().then(() => {
        	this.shopit.searchBusinesses(this.shopitcoordinates.getLat(), this.shopitcoordinates.getLng()).subscribe(data => {
        		this.shopitems.set(data);
        		this.items = this.shopitems.get();
        		localStorage.setItem('countStores', this.items.length);
        		this.redrawMap();
        		this.updateStoreBadge();
        		this.updateStoreList();
        		loader.dismiss();
        	});
        });
    }

    drawFreeHand() {

    	for(var i = 0; i < this.polys.length; i++) {
    		this.polys[i].setMap(null);
    	}

    	var poly = new google.maps.Polyline({map:this.map,clickable:false, strokeColor: "#009688"});

    	var move = google.maps.event.addListener(this.map,'mousemove', (e) => {
    		poly.getPath().push(e.latLng);
    	});

    	google.maps.event.addListenerOnce(this.map, 'mouseup', (e) => {
    		google.maps.event.removeListener(move);
    		var path = poly.getPath();
    		poly.setMap(null);
    		poly = new google.maps.Polygon({map:this.map,path:path, strokeColor: "#009688", fillColor: "#009688"});

    		google.maps.event.clearListeners(this.map.getDiv(), 'touchstart');
    		google.maps.event.clearListeners(this.map.getDiv(), 'mousedown');

    		var bounds = poly.getPath();

    		var coordinates = [];

    		bounds.forEach(function(xy, i) {
    			coordinates.push({ "lat": xy.lat(), "lon": xy.lng() });
    		});

    		bounds.forEach((xy, i) => {
    			this.polys.push(poly);
    		});

    		this.applyPolygon(coordinates);

    		this.enable();
    	})
    }


    disable() {
    	this.map.setOptions({
    		draggable: false, 
    		zoomControl: false, 
    		scrollwheel: false, 
    		gestureHandling: 'none',
    		disableDoubleClickZoom: false
    	});
    }

    enable(){
    	this.map.setOptions({
    		draggable: true, 
    		zoomControl: true, 
    		scrollwheel: true, 
    		gestureHandling: 'greedy',
    		disableDoubleClickZoom: true
    	});
    }

    /**
     * Removes all markers and overlays from the screen except the home marker
     **/
     resetMap() {

     	for (let i = 0; i < this.overlays.length; i++) {
     		this.overlays[i].overlay.setMap(null);
     	}
     	this.overlays = [];
     }

    /**
     * Redraws the map, adding markers for business locations
     **/
     redrawMap() {

     	this.removeMarkers();

     	for (var i = 0; i < this.items.length; i++) {
     		var nearestLocationLat = this.items[i]._source.coordinates["lat"];
     		var nearestLocationLng = this.items[i]._source.coordinates["lon"];

     		var nearestLocation = new google.maps.LatLng(nearestLocationLat, nearestLocationLng);

     		let marker = new google.maps.Marker({
     			map: this.map,
     			position: nearestLocation,
     			icon: {
     				url: 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png',
     				scaledSize: new google.maps.Size(35, 35)
     			}
     		});

     		this.mapMarkers.push(marker);

     		let content = "<strong>" + this.items[i].name + "</strong>";
     		content += "<p>" + this.items[i]._source.address + "</p>"

     		this.addInfoWindow(marker, content);
     	}
     }

    /**
     * Applies polygon searching to search for businesses within a user defined region
     **/
     applyPolygon(coordinates) {

        this.shopitcoordinates.setCoordinates(coordinates);

     	let loader = this.loading.create({
     		content: 'Updating Store Entries...',
     		cssClass: 'loadingwrapper'
     	});

        // update the list of businesses according to the list of coordinates
        loader.present().then(() => {
        	this.shopit.searchBusinessesPolygon(this.shopitcoordinates.getLat(), this.shopitcoordinates.getLng(), coordinates, "").subscribe(data => {
        		this.shopitems.set(data);
        		this.items = this.shopitems.get();
        		this.updateStoreBadge();
        		this.updateStoreList();
        		this.redrawMap();
        		loader.dismiss();
        	});
        });        
    }

    /**
     * Add an info screen for when the user selects a business marker
     **/
     addInfoWindow(marker, content) {

     	let infoWindow = new google.maps.InfoWindow({
     		content: content
     	});

     	google.maps.event.addListener(marker, 'click', () => {
     		infoWindow.open(this.map, marker);
     	});

     }

    /**
     * Removes all markers from the screen
     **/
     removeMarkers() {
     	console.log(this.mapMarkers.length);
     	for (let i = 0; i < this.mapMarkers.length; i++) {
     		this.mapMarkers[i].setMap(null);
     	}
     }
 }