var map;
var panel;
var initialize;
var calculate;
var direction;
var myMarker;
var routes;
var routesPoints=[];
var routesPointsIndex=0;
var currentDistance=0;
var routeIndex=0, legsIndex=0, stepsIndex=0, lat_lngsIndex=0;
var debug=true;

function initialize() 
{

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
	var myMarkerImage = new google.maps.MarkerImage('images/pickup.png');
    myMarker = new google.maps.Marker({
	// Coordonnées du cinéma
	position: myLatlng, 
	map: map,
	// Nous ajoutons un paramètre supplémentaire
	// icon pour lequel nous donnons le MarkerImage
	// que nous venons de créer.
	icon: myMarkerImage,
	title: "Joueur 1"
	});
	
	var inter=setInterval(function(){moveMarker(map,myMarker)},500);
	
	google.maps.event.addListener(myMarker, "click", function() {
    clearInterval(inter);
	});
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
	function getPoints(routes){
		var result=[];
		for (var i=0; i<routes.length;i++){
			for (var j=0;j<routes[i].legs.length;j++){
				for (var k=0;k<routes[i].legs[i].steps.length;k++){
					for(var l=0;l<routes[i].legs[i].steps[k].lat_lngs.length;l++){
						result.push(routes[i].legs[i].steps[k].lat_lngs[l])
					}
				}
			}
		}
		return result;
	}

	var request = {
		origin      : "Brest",
		destination : "Quimper",
		travelMode  : google.maps.DirectionsTravelMode.DRIVING // Type de transport
	}
	var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
	
	directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
            if(status == google.maps.DirectionsStatus.OK){
                direction.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
				routes = response.routes
				//alert('route length : ' + response.routes.length);
				routesPoints = getPoints(response.routes);
            }
	});
	

	google.maps.event.addDomListener(window, 'load', initialize);