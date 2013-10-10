var map, panel, initialize, bonusMarkers=[],
	calculate, direction, myMarker,
	routes, routesPoints=[],
	routesPointsIndex=0,
	currentDistance=0,
	routeIndex=0, legsIndex=0, stepsIndex=0, lat_lngsIndex=0,
	debug=true,
	request = {
		origin      : "Brest",
		destination : "Quimper",
		travelMode  : google.maps.DirectionsTravelMode.WALKING
	},
	directionsService = new google.maps.DirectionsService();

//google.maps.DirectionsTravelMode.BICYCLING
//google.maps.DirectionsTravelMode.WALKING
//google.maps.DirectionsTravelMode.DRIVING

function initialize() {

	var mapOptions = {
		zoom: 8,
		center: new google.maps.LatLng(48.144,-4.8),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById('mapDiv'),mapOptions);
  
	direction = new google.maps.DirectionsRenderer({
		map   : map, 
		panel : panel 
	});	
	
	var myLatlng = new google.maps.LatLng(48.144,-4.0320);
	
	//var myMarkerImage = new google.maps.MarkerImage('images/pickup.png');
	
	var myMarkerImage = new google.maps.MarkerImage('images/man.png');
	
	
    myMarker = new google.maps.Marker({
		position: myLatlng, 
		map: map,
		icon: {
                  url: 'images/man.png',
                  scaledSize: new google.maps.Size(30,30)
              },
		title: "Joueur 1"
	});
	
	var inter=setInterval(function(){moveMarker(map,myMarker)},500);
	var interBonus=setInterval(function(){popBonus(map)},5000);
	
	google.maps.event.addListener(myMarker, "click", function() {clearInterval(inter);});
	
	initMarkerZoomLevel();
	initRoute();
}

  /***************
 ** Fonctions **
**************/
function initMarkerZoomLevel(){
	google.maps.event.addListener(map, 'zoom_changed', function () {
		var currentZoom = map.getZoom();

		for(var i = 0; i < bonusMarkers.length; i++){
			if(currentZoom > 9){
				bonusMarkers[i].setVisible(true);
			} else  {
				bonusMarkers[i].setVisible(false);
			}
		}
	});
}
function popBonus(map){
	var ranNum1 = (Math.floor(Math.random() * 50))/100,
		ranNum2 = (Math.floor(Math.random() * 50))/100;
	
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(48.144+ranNum1,-4.0320+ranNum2), 
		map: map,
		icon: {url: 'images/marker-icon.png'},
		visible: false,
		title: "Bonus"
	});
	
	google.maps.event.addListener(marker, "click", function() {bonusClickEvt(marker);});
	
	bonusMarkers.push(marker);
	//marker.setMap(map);
}
function bonusClickEvt(marker){
	marker.setVisible(false);
	//bonusMarkers.pop(this);
}
function moveMarker( map, marker ) {    
	//myMarker.setPosition(new google.maps.LatLng(myMarker.getPosition().lat()+0.001,myMarker.getPosition().lng()+0.001));
	if(routes.length>0){
		//getNextPoint();
		myMarker.setPosition(getNextPoint());
	}
};
	
function getNextPoint(){
	var currentStep = routes[routeIndex].legs[legsIndex].steps[stepsIndex],
		currentStepDistance = currentStep.distance.value,
		currentStepNbPoints = currentStep.lat_lngs.length;
		metreByPoint = currentStepDistance/currentStepNbPoints;
		
	while( lat_lngsIndex <= currentStepNbPoints && parseInt($.playerData['metres'],10) > currentDistance + (metreByPoint * lat_lngsIndex) ){
		lat_lngsIndex++;
	}
		
	if(debug)
		$('#console').text('Distance en cours : ' + (currentDistance+(metreByPoint * lat_lngsIndex)) + ' - Distance Step en cours : '+currentStepDistance+
				' - metreByPoint : ' + metreByPoint +
				' - lat_lngsIndex : ' +lat_lngsIndex );
	
	if(currentStepNbPoints <= lat_lngsIndex){
		currentDistance += parseInt(currentStepDistance,10);
		stepsIndex++;
		lat_lngsIndex=0;
		return getNextPoint();
	}
	
	return currentStep.lat_lngs[lat_lngsIndex];
}

function initRoute(){
	directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
        if(status == google.maps.DirectionsStatus.OK){
			direction.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
			routes = response.routes
	    }
	});
}
//function getPoints(routes){
//	var result=[];
//	for (var i=0; i<routes.length;i++){
//		for (var j=0;j<routes[i].legs.length;j++){
//			for (var k=0;k<routes[i].legs[i].steps.length;k++){
//				for(var l=0;l<routes[i].legs[i].steps[k].lat_lngs.length;l++){
//					result.push(routes[i].legs[i].steps[k].lat_lngs[l])
//				}
//			}
//		}
//	}
//	return result;
//}






google.maps.event.addDomListener(window, 'load', initialize);
