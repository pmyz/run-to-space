//params players
// items : 0 not owned, 1 owned, 2 equiped
var defaultPlayersData={'metres':'0','bonusSpeed':'1','capSpeed':'1','bonusMetres':'0','capMetres':'1','endorphine':'0','bonusEndorphine':'1',
						items:{}};

var items=[	{name:'pied', id:'noobChoz', prize:'10', bonusSpeed : '1',capSpeed:'5',capMetres:'2',img:'images/feet.png'},
			{name:'bicyclette', id:'bicycle', prize:'10000', bonusSpeed : '5',capSpeed:'20',capMetres:'10',img:'images/man_bike.png'},
			{name:'206', id:'206', prize:'50000', bonusSpeed : '10',capSpeed:'30',capMetres:'13',img:'images/206/png/peugeot_206_red.png'},
			{name:'porsche', id:'porsche', prize:'100000', bonusSpeed : '15',capSpeed:'40',capMetres:'15',img:'images/porsche/Bleu.png'}
			];

var max_speedbonus=100;

function incrementerCompteur(){
	$.playerData['metres']=parseInt($.playerData['metres']+1+parseInt($.playerData['bonusMetres'],10))
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
function speedUp(prix,bonus,id,i){
	$('#error').html('');
	if($.playerData['endorphine']>=prix)
	{
		if(parseInt(items[i].capSpeed)>parseInt($.playerData['capSpeed']))
		{
		$.playerData['capSpeed']=items[i].capSpeed;
		$('#capSpeed').text(parseInt($.playerData['capSpeed']));
		myMarker.setIcon({url: items[i].img,scaledSize: new google.maps.Size(30,30)});
		}
		
		if($.playerData['bonusSpeed']<$.playerData['capSpeed'])
		{
		$.playerData['bonusSpeed']=parseInt($.playerData['bonusSpeed'],10)+bonus;
		$('#compteurEndorphine').text(parseInt($('#compteurEndorphine').text(),10)-prix);
		
		drawChart();
		$.playerData['endorphine']-=prix;	
		$('#bonusSpeed').text(parseInt($.playerData['bonusSpeed']));
		initIncrement();
		}else{
			$('#error').html('<font color="red"> bonus speed maximum</font>');
		}
		
	}else{
		$('#error').html('<font color="red"> pas assez d\'endorphine</font>');
	}
	
}
function metreUp(){
	$('#error1').html('');
	if($.playerData['endorphine']>=100)
	{
		$.playerData['bonusMetres']=parseInt($.playerData['bonusMetres'],10)+1;
		$('#compteurEndorphine').text(parseInt($('#compteurEndorphine').text(),10)-100);
		$.playerData['endorphine']-=100;
		initIncrement();
	}else{
		$('#error1').html('<font color="red"> pas assez d\'endorphine</font>');
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
function initShop(){
	var str='<table><tr><td align=center>Vehicules</td></tr><tr>', i;
	for(i=0;i<items.length;i++){
		str+='<tr><td><input onclick="speedUp('+items[i].prize+','+items[i].bonusSpeed+',\''+items[i].id+'\','+i+')" type=image height=64px width=64px src="'+items[i].img+'" id="btn_'+items[i].id+'" name="itemsBtn"></input></td>  <td>'+items[i].name+'('+items[i].prize+') capSpeed : '+items[i].capSpeed+' capMetres : '+items[i].capMetres+' bonusSpeed : '+items[i].bonusSpeed+'</tr>';
	}
	str+='</tr><span id="error"></span></td></table>';
	$('#shop').append(str);
}
	
google.load('visualization', '1', {packages:['gauge']});
google.setOnLoadCallback(drawChart);

function drawChart() {
	vitesse=parseInt(((1+$.playerData['bonusMetres'])*$.playerData['bonusSpeed']*1000)/7200).toFixed(2);
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