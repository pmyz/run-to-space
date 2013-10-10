//params players
// vehicle : 0 not owned, 1 owned, 2 equiped
var defaultPlayersData={'metres':'0','bonusSpeed':'1','capSpeed':'1','bonusMetres':'1','capMetres':'1','endorphine':'0','bonusEndorphine':'1',
						vehicle:{},tuning:{}};

var vehicle=[	{name:'pied', id:'noobChoz', prize:'10',capSpeed:'5',capMetres:'2',img:'images/feet.png'},
			{name:'bicyclette', id:'bicycle', prize:'10000',capSpeed:'20',capMetres:'10',img:'images/man_bike.png'},
			{name:'206', id:'206', prize:'50000',capSpeed:'30',capMetres:'13',img:'images/206/png/peugeot_206_red.png'},
			{name:'porsche', id:'porsche', prize:'100000',capSpeed:'40',capMetres:'15',img:'images/porsche/Bleu.png'}
			];
			
var tuning=[{name:'bonus1', id:'bonus1', prize:'10',bonusSpeed:'5',bonusMetres:'2',img:'images/feet.png'},
			{name:'bonus2', id:'bonus2', prize:'100',bonusSpeed:'20',bonusMetres:'10',img:'images/man_bike.png'},
			{name:'bonus3', id:'bonus3', prize:'500',bonusSpeed:'30',bonusMetres:'13',img:'images/206/png/peugeot_206_red.png'},
			{name:'bonus4', id:'bonus4', prize:'1000',bonusSpeed:'40',bonusMetres:'15',img:'images/porsche/Bleu.png'}
			];
			
function incrementerCompteur(){
	$.playerData['metres']=parseInt($.playerData['metres']+parseInt($.playerData['bonusMetres'],10))
	$('#compteurMetre').text(convertDistance($.playerData['metres']));
}

function incrementerEndorphine(){
	$('#compteurEndorphine').text(parseInt($('#compteurEndorphine').text(),10)+1000);
	$.playerData['endorphine']=parseInt($('#compteurEndorphine').text(),10);
}
function saveData(){
	localStorage.setItem("playerData", JSON.stringify($.playerData));
}
function resetData(){
	localStorage.removeItem("playerData");
	$.playerData=$.extend(true,'',defaultPlayersData);
	$('#compteurMetre').text('0');
	$('#compteurEndorphine').text('0');
}
function loadData(){
	if(localStorage){
		var _data=localStorage.getItem("playerData");
		if($.trim(_data).length>0) {
			return JSON.parse(_data);
		} else {
			return $.extend(true,'',defaultPlayersData);
		}
	} else {
		alert('Navigateur non compatible');
	}
}

function convertDistance(distance)
{
	if(distance < 1000){
		return distance+" m";
	}else{
		return (distance/1000)+" km";
	}
}
function speedUp(prix,bonusSpeed,bonusMetres,i){
	$('#error').html('');
	if($.playerData['endorphine']>=prix)
	{
	
		//deduction du prix
		$('#compteurEndorphine').text(parseInt($('#compteurEndorphine').text(),10)-prix);
		$.playerData['endorphine']-=prix;
		
		//update speed
		if($.playerData['bonusSpeed']<$.playerData['capSpeed'])
		{
		$.playerData['bonusSpeed']=parseInt($.playerData['bonusSpeed'])+bonusSpeed;
		$('#bonusSpeed').text(parseInt($.playerData['bonusSpeed']));
		
		//augmentation du prix de l'objet
		tuning[i].prize=prix*prix;
		
		}else{
			$.playerData['bonusSpeed']=$.playerData['capSpeed']
			$('#bonusSpeed').text(parseInt($.playerData['bonusSpeed']));
			$('#error').html('<font color="red"> cap speed atteint</font>');
		}
		
		//update metre
		if($.playerData['bonusMetres']<$.playerData['capMetres'])
		{
		$.playerData['bonusMetres']=parseInt($.playerData['bonusMetres'])+bonusMetres;
		$('#bonusMetres').text($.playerData['bonusMetres'])
		}else{
			$.playerData['bonusMetres']=$.playerData['capMetres']
			$('#bonusMetres').text(parseInt($.playerData['bonusMetres']));
			$('#error').html('<font color="red"> cap metres atteint</font>');
		}
		
		//update compteur vitesse
		drawChart();
		
		initIncrement();
		
		
	}else{
		$('#error').html('<font color="red"> pas assez d\'endorphine</font>');
	}
	
}

function newVehicle(prix,i)
{
	$('#error').html('');
	if($.playerData['endorphine']>=prix)
	{
		//deduction du prix
		$('#compteurEndorphine').text(parseInt($('#compteurEndorphine').text(),10)-prix);
		$.playerData['endorphine']-=prix;	
		
		//update cap speed
		if(parseInt(vehicle[i].capSpeed)>parseInt($.playerData['capSpeed']))
		{
			$.playerData['capSpeed']=vehicle[i].capSpeed;
			$('#capSpeed').text(parseInt($.playerData['capSpeed']));
			myMarker.setIcon({url: vehicle[i].img,scaledSize: new google.maps.Size(30,30)});
		}else{
			$('#error').html('<font color="red"> Vous avez deja un meilleur vehicule speed maximum</font>');
		}
		
		//update cap metres
		if(parseInt(vehicle[i].capMetres)>parseInt($.playerData['capMetres']))
		{
		$.playerData['capMetres']=vehicle[i].capMetres;
		$('#capMetres').text(parseInt($.playerData['capMetres']));
		myMarker.setIcon({url: vehicle[i].img,scaledSize: new google.maps.Size(30,30)});
		}else{
			$('#error').html('<font color="red"> Vous avez deja un meilleur vehicule speed maximum</font>');
		}
	}else{
		$('#error').html('<font color="red"> pas assez d\'endorphine</font>');
	}
}

function initIncrement(){
	clearInterval($.interval);
	clearInterval($.interval1);
	$.interval = setInterval(incrementerCompteur, 1000/parseInt($.playerData['bonusSpeed'],10));
	$.interval1 = setInterval(incrementerEndorphine, 1000/parseInt($.playerData['bonusEndorphine'],10));
}
function reloadInterval(){
	clearInterval($.interval);
	clearInterval($.interval1);
}
function initVehicle(){
	var str='<table><tr><td align=center>Vehicules</td></tr><tr>', i;
	for(i=0;i<vehicle.length;i++){
		str+='<tr><td><input onclick="newVehicle('+vehicle[i].prize+','+i+')" type=image height=64px width=64px src="'+vehicle[i].img+'" id="btn_'+vehicle[i].id+'" name="itemsBtn"></input></td>  <td>'+vehicle[i].name+'('+vehicle[i].prize+') capSpeed : '+vehicle[i].capSpeed+' capMetres : '+vehicle[i].capMetres+'</tr>';
	}
	str+='</tr><span id="error"></span></td></table>';
	$('#vehicle').append(str);
}

function initTuning(){
	var str='<table><tr><td align=center>Tuning</td></tr><tr>', i;
	for(i=0;i<tuning.length;i++){
		str+='<tr><td><input onclick="speedUp('+tuning[i].prize+','+tuning[i].bonusSpeed+','+tuning[i].bonusMetres+','+i+')" type=image height=64px width=64px src="'+tuning[i].img+'" id="btn_'+tuning[i].id+'" name="itemsBtn"></input></td>  <td>'+tuning[i].name+'('+tuning[i].prize+') bonusSpeed : '+tuning[i].bonusSpeed+' bonusMetres : '+tuning[i].bonusMetres+' </tr>';
	}
	str+='</tr><span id="error"></span></td></table>';
	$('#tuning').append(str);
}
	
google.load('visualization', '1', {packages:['gauge']});
google.setOnLoadCallback(drawChart);

function drawChart() {
	vitesse=parseInt(($.playerData['bonusMetres']*$.playerData['bonusSpeed'])*3600/1000);
	var data = google.visualization.arrayToDataTable([
	  ['Label', 'Value'],
	  ['Vitesse (km/h)', parseInt(vitesse)]
	]);

	var options = {
	  width: 500, height: 220,
	  redFrom: 90, redTo: 100,
	  yellowFrom:75, yellowTo: 90,
	  minorTicks: 5
	};

	var chart = new google.visualization.Gauge(document.getElementById('vitesse'));
	chart.draw(data, options);
}
