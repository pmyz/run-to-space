//params players
// items : 0 not owned, 1 owned, 2 equiped
var defaultPlayersData={'metres':'0','bonusSpeed':'1', 'bonusMetres':'0','endorphine':'0','bonusEndorphine':'1',
						items:{}};

var items=[	{name:'claquette', id:'noobChoz', prize:'10', speedBonus:'5'},
			{name:'chaussure de ville', id:'cityChoz', prize:'100', speedBonus:'10'},
			{name:'chaussure de sport', id:'sportChoz', prize:'1000', speedBonus:'25'}];

function incrementerCompteur(){
	$('#compteurMetre').text(parseInt($('#compteurMetre').text(),10)+1+parseInt($.playerData['bonusMetres'],10));
	$.playerData['metres']=parseInt($('#compteurMetre').text(),10);
}

function incrementerEndorphine(){
	$('#compteurEndorphine').text(parseInt($('#compteurEndorphine').text(),10)+1);
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
function speedUp(){
	$('#error').html('');
	if($.playerData['endorphine']>=10)
	{
		$.playerData['bonusSpeed']=parseInt($.playerData['bonusSpeed'],10)+1;
		$('#compteurEndorphine').text(parseInt($('#compteurEndorphine').text(),10)-10);
		initIncrement();
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
function toggleShop(){
	if($('#shopDiv').length==0){
		var str='<div id="shopDiv"><table><tr>', i;
		for(i=0;i<items.length;i++){
			str+='<td><button id="btn_'+items[i].id+'" name="itemsBtn">'+items[i].name+'</button></td>';
		}
		str+='</tr></table></div>';
		$('#div3').append(str);
	}
	$('#shopDiv').toggle();
}
