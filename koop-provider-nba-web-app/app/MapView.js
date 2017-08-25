define([
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',

  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/dom',
  'dojo/on',

  'esri/renderers/UniqueValueRenderer',
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
  UniqueValueRenderer, Point, Graphic, InfoTemplate, FeatureLayer, ArcGISTiledMapServiceLayer, Map, esriRequest, PictureMarkerSymbol
) {
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: '<div class="map-container"></div>',
    baseServiceUrl: 'http://GREHKEMPER.ESRI.COM:8080/nba/',
    // Widget LifeCycle
    postCreate: function() {
      this.inherited(arguments);
      // Create the map
      this.map = new Map(this.domNode, {
        basemap: "dark-gray",
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
        definitionExpression: 'SEASON = ' + year,
        outFields: ['*']
      });
      this.nbaFeatureLayer.setRenderer(this.getRenderer());
      this.map.addLayer(this.nbaFeatureLayer);
    },

    getRenderer: function() {
      var uvrJson = {"type": "uniqueValue",
        "field1": "EVENT_TYPE",
        "defaultSymbol": {
          "color": [0, 0, 0, 64],
          "outline": {
            "color": [0, 0, 0, 255],
            "width": 1,
            "type": "esriSMS",
            "style": "esriSMSCircle"
          },
          "type": "esriSFS",
          "style": "esriSFSNull"
        },
        "uniqueValueInfos": [{
          "value": "Missed Shot",
          "symbol": {
            "color": [255, 0, 0, 128],
            "outline": {
              "color": [0, 0, 0, 255],
              "width": 1,
              "type": "esriSLS",
              "style": "esriSLSSolid"
            },
            "type": "esriSMS",
            "style": "esriSMSCircle"
          }
        }, {
          "value": "Made Shot",
          "symbol": {
            "color": [0, 255, 0, 128],
            "outline": {
              "color": [0, 0, 0, 255],
              "width": 1,
              "type": "esriSLS",
              "style": "esriSLSSolid"
            },
            "type": "esriSMS",
            "style": "esriSMSCircle"
          }
        }]
      };
      
      return new UniqueValueRenderer(uvrJson);
    }
  });
});