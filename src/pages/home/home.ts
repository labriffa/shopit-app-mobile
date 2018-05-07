import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SinglePage } from '../single/single';
import { Shopit } from '../../providers/shopit/shopit';
import { ShopitItems } from '../../providers/shopitems/shopitems';
import { ShopitCoordinates } from '../../providers/shopit-coordinates/shopit-coordinates';
import { SearchTermProvider } from '../../providers/search-term/search-term';
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
	map: any;
	mapMarkers: any[] = [];
	overlays: any[] = [];
	polys: any[] = [];
    isDrawToolTip: boolean = false;

	constructor(public navCtrl: NavController, private loading: LoadingController, private geolocation: Geolocation, public platform: Platform,
		private shopit: Shopit, public events: Events, private searchTerm: SearchTermProvider, private shopitems: ShopitItems, private shopitcoordinates: ShopitCoordinates) {
		this.initializeItems();
	}

    /**
     * Loads the businesses according to the user's current location
     **/
     initializeItems() {
        // development values
        if(1) {
        //if (this.platform.is('core') || this.platform.is('mobileweb')) {
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

    /**
    * Publishes the number of stores
    **/
    updateStoreBadge() {
    	this.events.publish('storeBadge:update', this.items.length);
    }

    /**
    * Publishes the list of stores found
    **/
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

     showDrawToolTip() {
        this.isDrawToolTip = true;
     }

     hideDrawToolTip() {
        this.isDrawToolTip = false;
     }

    /**
     * Loads the map when this view has loaded
     **/
     ionViewDidLoad() {
     	this.loadMap();
     }

    /**
     * Intializes the map and sets styles
     **/
     loadMap() {
        // development values
        if(1) {
        //if(this.platform.is('core') || this.platform.is('mobileweb')) {
            let latLng = new google.maps.LatLng(this.shopitcoordinates.getLat(), this.shopitcoordinates.getLng());

            this.initializeMap(latLng);
            

        } else {
            this.geolocation.getCurrentPosition().then((position) => {

                let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                this.initializeMap(latLng);

            }, (err) => {
                console.log(err);
            });
        }
    }

     /**
     * Initializes map
     **/
     initializeMap(latLng) {
        let mapOptions = {
            center: latLng,
            zoom: 14,
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

            // create the map
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

            // handle draw poly selection
            document.querySelector("#drawpoly a").addEventListener("click", (event) => {
                event.preventDefault();

                this.disableMap();
                this.hideDrawToolTip();

                // set default css classes
                document.querySelector("#drawpoly").className = "active";
                document.querySelector("#stopDrawing").className = "display";

                // allow freehand on touchstart or mousedown (for desktops)
                google.maps.event.addDomListener(this.map.getDiv(),'touchstart', (e) => {
                    this.drawFreeHand()
                });

                google.maps.event.addDomListener(this.map.getDiv(),'mousedown', (e) => {
                    this.drawFreeHand()
                });
            });


            document.querySelector("#stopDrawing a").addEventListener("click", (event) => {
                event.preventDefault();

                // remove polygons from the map
                for(let i = 0; i < this.polys.length; i++) {
                    this.polys[i].setMap(null);
                }

                // hide stop drawing and re-enable start drawing
                document.querySelector("#stopDrawing").className = "display-none";
                document.querySelector("#drawpoly").className = "inactive";

                // refresh businesses
                this.searchBusinesses();

                // re-apply coordinates
                this.shopitcoordinates.setCoordinates([]);

                // allow user to rescroll map
                this.enableMap();
            });

            let marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: this.map.getCenter()
            });

            let content = "<h4>You are Here!</h4>";         

            this.addInfoWindow(marker, content);
        }

     /**
     * Searches for businesses
     **/
     searchBusinesses() {

     	this.removeMarkers();

        // apply loading dialog
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

    /**
    * Removes polygons from screen
    **/
    removeMapPolylines() {
        for(let i = 0; i < this.polys.length; i++) {
            this.polys[i].setMap(null);
        }
    }

    createMapPolyline() {

        const STROKE_BLUE = '#009688';
        const FILL_BLUE = '#009688';

        let poly = new google.maps.Polyline({
            map:this.map,
            clickable:false, 
            strokeColor: STROKE_BLUE
        });

        return poly;
    }

    createMapPolygon(path) {

        const STROKE_BLUE = '#009688';
        const FILL_BLUE = '#009688';

        let poly = new google.maps.Polygon({
            map:this.map,path:path, 
            strokeColor: STROKE_BLUE, 
            fillColor: FILL_BLUE
        });

        return poly;
    }

    /**
    * Removes listeners from the Google map so users can interact with map contents
    **/
    removeMapListeners() {
        google.maps.event.clearListeners(this.map.getDiv(), 'touchstart');
        google.maps.event.clearListeners(this.map.getDiv(), 'mousedown');
    }

    /**
    * Provides freehand map drawing functionality
    **/
    drawFreeHand() {

        this.removeMapPolylines();

    	let poly = this.createMapPolyline();

        // aggregate latitude and longitude objects to the prexisting polyline
    	let move = google.maps.event.addListener(this.map,'mousemove', (e) => {
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

            this.applyPolygonSearch(coordinates);

            this.enableMap();
    	})
    }

    getCoordinatesFromBounds(bounds) {

        let coordinates = [];

        bounds.forEach(function(xy, i) {
            coordinates.push({ "lat": xy.lat(), "lon": xy.lng() });
        });

        return coordinates;
    }

    /**
    * Disables scrolling of the map
    **/
    disableMap() {
    	this.map.setOptions({
    		draggable: false, 
    		zoomControl: false, 
    		scrollwheel: false, 
    		gestureHandling: 'none',
    		disableDoubleClickZoom: false
    	});
    }

    /**
    * Re-enables the map for scrolling
    **/
    enableMap(){
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

     	for(let i = 0; i < this.items.length; i++) {
     		let lat = this.items[i]._source.coordinates["lat"];
     		let lng = this.items[i]._source.coordinates["lon"];

     		let latLng = new google.maps.LatLng(lat, lng);

     		let mapMarker = this.generateMapMarker(latLng);

     		this.mapMarkers.push(mapMarker);

            let title = this.items[i].name;
            let body = this.items[i]._source.address
            let content = this.generateMapContent(title, body);

     		this.addInfoWindow(mapMarker, content);
     	}
     }

     generateMapMarker(latLng) {
        let marker = new google.maps.Marker({
            map: this.map,
            position: latLng,
            icon: {
                url: 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png',
                scaledSize: new google.maps.Size(30, 30)
            }
        });

        return marker;
     }

     generateMapContent(title, body) {
        let content = "<strong>" + title + "</strong>";
            content += "<p>" + body + "</p>";

        return content;
     }

    /**
     * Applies polygon searching to search for businesses within a user defined region
     **/
     applyPolygonSearch(coordinates) {

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
     	for (let i = 0; i < this.mapMarkers.length; i++) {
     		this.mapMarkers[i].setMap(null);
     	}
     }

     login() {
        this.navCtrl.push('LoginPage');
     }

     stores() {
        this.searchTerm.set(this.myInput);
        this.navCtrl.parent.select(2); 
     }
 }