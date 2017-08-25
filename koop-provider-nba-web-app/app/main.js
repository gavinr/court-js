require([
  'app/MapView',
  'app/Controls',

  'dojo/on',

  'dojo/domReady!'
], function(
    MapView, 
    Controls,
  
    on
  ) {
  var mapNode = document.getElementById('map');
  var mapView = new MapView(null, mapNode);
  
  var controlsWrapperNode = document.getElementById('controlsWrapper');
  var controls = new Controls();
  controls.placeAt(controlsWrapperNode, 'last');
  controls.startup();

  on(controls, 'change', function(evt) {
    mapView.updateNbaLayer(evt.playerId, evt.year);
  });
});