import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

import { ProductsPage } from '../products/products';
import { StoresPage } from '../stores/stores';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = StoresPage;
  tab3Root = ProductsPage;
  private listCount;
  
  constructor(public events: Events) {
  	events.subscribe('storeBadge:update', (num) => {
    	this.listCount = num;
  	});
  }
}
