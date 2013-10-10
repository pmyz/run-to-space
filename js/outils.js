//params players
// vehicle : 0 not owned, 1 owned, 2 equiped
var defaultPlayersData={'metres':'0','bonusSpeed':'1','capSpeed':'1','bonusMetres':'1','capMetres':'1','euros':'0','bonusEuros':'1',
						vehicle:{},tuning:{}};

var vehicle=[	{name:'pied', id:'noobChoz', prize:'10',capSpeed:'5',capMetres:'2',img:'images/feet.png'},
			{name:'bicyclette', id:'bicycle', prize:'10000',capSpeed:'20',capMetres:'10',img:'images/man_bike.png'},
			{name:'206', id:'206', prize:'50000',capSpeed:'30',capMetres:'13',img:'images/206/png/peugeot_206_red.png'},
			{name:'porsche', id:'porsche', prize:'100000',capSpeed:'40',capMetres:'15',img:'images/porsche/Bleu.png'}
			];
			
var tuning=[{name:'Tenue de route', id:'tenue', prize:'10',bonusSpeed:'0.01',bonusMetres:'0.001',img:'images/pneu.png'},
			{name:'Boost Moteur', id:'chevaux', prize:'100',bonusSpeed:'0.11',bonusMetres:'0.01',img:'images/moteur.png'},
			{name:'Allègement Carroserie', id:'allegement', prize:'500',bonusSpeed:'0.6',bonusMetres:'0.1',img:'images/plume.png'},
			{name:'Nitro', id:'Nitro', prize:'1000',bonusSpeed:'1.5',bonusMetres:'0.22',img:'images/nos2.jpg'}
			];
			
function incrementerCompteur(){
	$.playerData['metres']=parseInt($.playerData['metres']+parseInt($.playerData['bonusMetres'],10))
	$('#compteurMetre').text(convertDistance($.playerData['metres']));
}

function incrementerEuros(){
	$('#compteurEuros').text(parseInt($('#compteurEuros').text(),10)+1000);
	$.playerData['euros']=parseInt($('#compteurEuros').text(),10);
}
function saveData(){
	localStorage.setItem("playerData", JSON.stringify($.playerData));
}
function resetData(){
	localStorage.removeItem("playerData");
	$.playerData=$.extend(true,'',defaultPlayersData);
	$('#compteurMetre').text('0');
	$('#compteurEuros').text('0');
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
	if($.playerData['euros']>=prix)
	{

		
		//update speed
		if((parseFloat($.playerData['bonusSpeed'])+bonusSpeed)<$.playerData['capSpeed'])
		{
			
			//deduction du prix
			$('#compteurEuros').text(parseInt($('#compteurEuros').text(),10)-prix);
			$.playerData['euros']-=prix;
			
			//augmentation du prix de l'objet
			tuning[i].prize=prix*2;
			initTuning();
						
			$.playerData['bonusSpeed']=parseFloat($.playerData['bonusSpeed'])+bonusSpeed;
			$('#bonusSpeed').text($.playerData['bonusSpeed'].toFixed(2));
		}
		else
		{
			//Si on dépasse le cap avec la prochaine amélioration , on mets le speed au cap max 
			if(parseInt($.playerData['bonusSpeed'])<$.playerData['capSpeed'])
			{
				//et on deduit le prix
				$('#compteurEuros').text(parseInt($('#compteurEuros').text(),10)-prix);
				$.playerData['euros']-=prix;
			
			$.playerData['bonusSpeed']=$.playerData['capSpeed']
			$('#bonusSpeed').text(parseInt($.playerData['bonusSpeed']));
			}else{
			$('#error').html('<font color="red"> cap speed atteint</font>');
			}
		}
		
		//update metre
		if((parseInt($.playerData['bonusMetres'])+bonusMetres)<$.playerData['capMetres'])
		{
		$.playerData['bonusMetres']=parseInt($.playerData['bonusMetres'])+bonusMetres;
		$('#bonusMetres').text($.playerData['bonusMetres'])
		
		//update compteur vitesse
		drawChart();
		}else{
			$.playerData['bonusMetres']=$.playerData['capMetres']
			$('#bonusMetres').text(parseInt($.playerData['bonusMetres']));
			$('#error').html('<font color="red"> cap metres atteint</font>');
		}
		initIncrement();		
		
	}else{
		$('#error').html('<font color="red"> pas assez d\'euros</font>');
	}
	
}

function newVehicle(prix,i)
{
	$('#error').html('');
	if($.playerData['euros']>=prix)
	{
		//deduction du prix
		$('#compteurEuros').text(parseInt($('#compteurEuros').text(),10)-prix);
		$.playerData['euros']-=prix;	
		
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
		$('#error').html('<font color="red"> pas assez d\'euros</font>');
	}
}

function initIncrement(){
	clearInterval($.interval);
	clearInterval($.interval1);
	$.interval = setInterval(incrementerCompteur, 1000/parseInt($.playerData['bonusSpeed'],10));
	$.interval1 = setInterval(incrementerEuros, 1000/parseInt($.playerData['bonusEuros'],10));
}
function reloadInterval(){
	clearInterval($.interval);
	clearInterval($.interval1);
}
function initVehicle(){
	var str='<table><tr><td></td><td id=title>Vehicules<br/><br/></td></tr><tr>', i;
	for(i=0;i<vehicle.length;i++){
		str+='<tr>'
		str+='	<td>'
		str+='		<input onclick="newVehicle('+vehicle[i].prize+','+i+')" type=image height=64px width=64px src="'+vehicle[i].img+'" id="btn_'+vehicle[i].id+'" name="itemsBtn"/>'
		str+='	</td>'
		str+='	<td>'
		str+='		<table>'
		str+='			<tr>'
		str+='				<td>'
		str+='				'+vehicle[i].name+' : '+vehicle[i].prize+'€'
		str+='				</td>'
		str+='			</tr>'
		str+='			<tr>'
		str+='				<td id=info>'
		str+='					CapSpeed : '+vehicle[i].capSpeed+''
		str+='					CapMetres : '+vehicle[i].capMetres+' '
		str+='  			</td>'
		str+='			</tr>'
		str+='		</table>'
		str+='	</td>'
		str+='</tr>';
	}
	str+='</tr><span id="error"></span></td></table>';
	$('#vehicle').append(str);
}

function initTuning(){
	$('#tuning').text("");
	var str='<table><tr><td></td><td id=title>Tuning<br/><br/></td></tr><tr>', i;
	for(i=0;i<tuning.length;i++){
		str+='<tr>'
		str+='	<td>'
		str+='		<input onclick="speedUp('+tuning[i].prize+','+tuning[i].bonusSpeed+','+tuning[i].bonusMetres+','+i+')" type=image height=64px width=64px src="'+tuning[i].img+'" id="btn_'+tuning[i].id+'" name="itemsBtn"/>'
		str+='	</td>'
		str+='	<td>'
		str+='		<table>'
		str+='			<tr>'
		str+='				<td>'
		str+='				'+tuning[i].name+' : '+tuning[i].prize+'€'
		str+='				</td>'
		str+='			</tr>'
		str+='			<tr>'
		str+='				<td id=info>'
		str+='					bonusSpeed : '+tuning[i].bonusSpeed+''
		str+='					bonusMetres : '+tuning[i].bonusMetres+' '
		str+='  			</td>'
		str+='			</tr>'
		str+='		</table>'
		str+='	</td>'
		str+='</tr>';
	}
	str+='</tr><span id="error"></span></td></table>';
	$('#tuning').append(str);
}
	
google.load('visualization', '1', {packages:['gauge']});
google.setOnLoadCallback(drawChart);

function drawChart() {
	vitesse=((parseFloat($.playerData['bonusMetres'])*parseFloat($.playerData['bonusSpeed']))*3600/1000).toFixed(2);
	var data = google.visualization.arrayToDataTable([
	  ['Label', 'Value'],
	  ['Vitesse (km/h)', parseFloat(vitesse)]
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
