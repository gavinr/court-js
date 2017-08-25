define([
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',

  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/dom',
  'dojo/on',

  'esri/geometry/Point',
  'esri/graphic',
  'esri/InfoTemplate',
  'esri/layers/FeatureLayer',
  'esri/layers/ArcGISTiledMapServiceLayer',
  'esri/map',
  'esri/request',
  'esri/symbols/PictureMarkerSymbol',
], function(
  _WidgetBase, _TemplatedMixin,
  declare,
  lang, dom, on,
  Point, Graphic, InfoTemplate, FeatureLayer, ArcGISTiledMapServiceLayer, Map, esriRequest, PictureMarkerSymbol
) {
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: '<div class="map-container"></div>',
    baseServiceUrl: 'http://GREHKEMPER.ESRI.COM:8080/nba/',
    // Widget LifeCycle
    postCreate: function() {
      this.inherited(arguments);
      // Create the map
      this.map = new Map(this.domNode, {
        basemap: "gray",
        center: [0, 0.001],
        zoom: 18
      });
      this.set('map', this.map);
      this.addBasketballCourt();
    },
    addBasketballCourt: function() {
      this.basketballCourtLayer = new ArcGISTiledMapServiceLayer('https://tiles4.arcgis.com/tiles/g2TonOxuRkIqSOFx/arcgis/rest/services/Slate_BaseketballCourt/MapServer');
      this.map.addLayer(this.basketballCourtLayer);
    },
    updateNbaLayer: function(playerId, year) {
      console.log('updateNbaLayer', playerId, year);
      if(this.nbaFeatureLayer) {
        this.map.removeLayer(this.nbaFeatureLayer);
      }

      this.nbaFeatureLayer = new FeatureLayer(this.baseServiceUrl + playerId + '/FeatureServer/0', {
        definitionExpression: 'SEASON = ' + year
      });
      this.map.addLayer(this.nbaFeatureLayer);
    }
  });
});