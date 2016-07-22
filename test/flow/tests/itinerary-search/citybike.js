module.exports = {
  tags: ['citybike'],
  'Citybikes are used when it\'s the only modality': (browser) => {
    browser.url(browser.launch_url);
    browser.page.messages().clickMessagebarClose();  // TODO Shouldn't be needed

    browser.page.searchFields().itinerarySearch('Katajanokka', 'Kauppatori');

    const customizeSearch = browser.page.customizeSearch();
    customizeSearch.clickCanvasToggle();
    customizeSearch.disableAllModalitiesExcept('citybike');
    customizeSearch.enableModality('citybike');

    browser.page.itinerarySummary().waitForItineraryRowOfType('citybike');

    browser.end();
  },

  'Citybikes are not used when disabled': (browser) => {
    browser.url(browser.launch_url);
    browser.page.messages().clickMessagebarClose();  // TODO Shouldn't be needed

    browser.page.searchFields().itinerarySearch('Katajanokka', 'Kauppatori');

    const customizeSearch = browser.page.customizeSearch();
    customizeSearch.clickCanvasToggle();
    customizeSearch.disableAllModalitiesExcept();

    browser.page.itinerarySummary().waitForItineraryRowOfTypeNotPresent('citybike');

    browser.end();
  },
};
