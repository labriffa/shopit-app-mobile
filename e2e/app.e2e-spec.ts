import { browser, element, by, ElementFinder } from 'protractor';
 
describe('E2E Test Suite', () => {
 
  beforeEach(() => {
    browser.get('/');

    // Wait for the page transition
    browser.driver.sleep(10000);
  });

  afterEach(function() {
    browser.restart();
  });
 
  it('the home tab is displayed by default', () => {
      expect(element(by.css('[aria-selected=true] .tab-button-text')) // Grab the title of the selected tab
        .getAttribute('innerHTML')) // Get the text content
        .toContain('Map'); // Check if it contains the text "Map"
  });
 
  it('the user can go to the list tab and view nearby businesses', () => {
    // Click the 'List' tab
    element(by.css('#tab-t0-1')).click().then(() => {
      browser.driver.sleep(5000);
      expect(element(by.css('.card-title h1')) // Grab the label of the list item
        .getAttribute('innerHTML')) // Get the text content
        .toContain('The General Store'); // Check if it contains the text "The General Store"
    });
  });

  it('the user can go to the products tab and search for nearby products', () => {
    // Click the 'List' tab
    element(by.css('#tab-t0-2')).click().then(() => {
      browser.driver.sleep(5000);
      expect(element(by.css('#cart')).isPresent());
    });
  });

  it('the cancel map drawing button is shown when the user selects the draw button', () => {
    element(by.css('#drawpoly')).click().then(() => {
      browser.driver.sleep(1000);
      expect(element(by.css('#stopDrawing')) // Get the stop drawing button
        .getAttribute('class')) // Get the class
        .toMatch('display'); // Check if the stop drawing button is showing
    });
  });

  it('the cancel map drawing button is hidden when clicked on', () => {
    element(by.css('#drawpoly')).click();
    browser.driver.sleep(1000);
    element(by.css('#stopDrawing')).click().then(() => {
      browser.driver.sleep(1000);
      expect(element(by.css('#stopDrawing')) // Get the stop drawing button
        .getAttribute('class')) // Get the class
        .toMatch('display-none'); // Check if the stop drawing button is showing
    });
  });

  it('selecting a store on the map provides a pop info box', () => {
    element.all(by.css('.gmnoprint')).get(1).click().then(() => {
      browser.driver.sleep(5000);
      expect(element.all(by.css('.gm-style-iw')).get(1).isPresent());
    });
  });

  it('drawing a polygon search should trigger the loading modal', () => {
    element(by.css('#drawpoly')).click();
    var map = element(by.css('#map'));

    // draw a triangle on the map
    browser.actions()
      .mouseMove(map, {x: 400, y: 400}) // 400px from left, 400 px from top of map
      .mouseDown()
      .mouseMove({x: 400, y: 200}) 
      .mouseMove({x: 0, y: 200})
      .mouseMove({x: -400, y: 0})
      .mouseMove({x: 0, y: -200})   
      .mouseUp()
      .perform();
      expect(element(by.css('.loadingwrapper')).isPresent()) // Make sure loading screen appears
  });

  it('drawing a polygon search should update the tab badge displaying the number of stores', () => {
    element(by.css('#drawpoly')).click();
    var oldBadgeCount = 0;
    element(by.css('.tab-badge')).getText().then(function(text){
      oldBadgeCount = parseInt(text);

      var map = element(by.css('#map'));
      browser.actions()
        .mouseMove(map, {x: 400, y: 400}) // 100px from left, 100 px from top of plot0
        .mouseDown()
        .mouseMove({x: 400, y: 200}) 
        .mouseMove({x: 0, y: 200})
        .mouseMove({x: -400, y: 0})
        .mouseMove({x: 0, y: -200})   
        .mouseUp()
        .perform();
        browser.driver.sleep(5000);
        var newBadgeCount = 0;
        element(by.css('.tab-badge')).getText().then(function(text){
          var newBadgeCount = parseInt(text);
          expect(newBadgeCount).toBeLessThan(oldBadgeCount)
        });
    });
  });

  it('the user can browse to the products tab and search for products', () => {
    // Click the 'Products' tab
    element(by.css('#tab-t0-2')).click();
    browser.driver.sleep(5000);
    element.all(by.css('.searchbar-input')).get(1).sendKeys('dress');
    element.all(by.css('.search-icon')).get(1).click().then(() => {
      browser.driver.sleep(5000);
      expect(element(by.css('.referal')).isPresent());
    });
  });
});