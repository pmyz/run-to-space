


var games=[	{name:'double', id:'double', prize:'500',bonusEuros:'0',img:'images/banque/cash.png'},
			{name:'banque', id:'banque', prize:'1',bonusEuros:'1',img:'images/banque/bank.png'}];

function DoubleOrNot()
{
	$('#error').html('');
	if($.playerData['euros']>500)
	{
		ran = (Math.floor(Math.random() * 100));
		$.playerData['euros']=$.playerData['euros']-500;
		if(ran>=50)
		{
		$.playerData['euros']=$.playerData['euros']*2;
		$("#compteurEuros").css('color','green');
		$('#compteurEuros').text(parseInt($.playerData['euros']));
		$("#compteurEuros").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
		}else{
		$.playerData['euros']=$.playerData['euros']/2;
		$("#compteurEuros").css('color','red');
		$('#compteurEuros').text(parseInt($.playerData['euros']));
		$("#compteurEuros").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
		}
		setTimeout(resetColor,500);
	}else{
		$('#double_error').html('<font color="red"> Pas assez d\'€</font>');
	}
}

function resetColor()
{
	$("#compteurEuros").css('color','white');
}

function Bank(prix)
{
	if($.playerData['euros']>prix)
	{
		$.playerData['bonusEuros']=parseInt($.playerData['bonusEuros'])+1;
		games[1].prize=games[1].prize*2;
		initCasino();
	}
}

function initCasino()
{
	$('#casino').text("");
	str='<table>'
	str+='	<tr>'
	str+='		<td id="double_error"></td>'
	str+='		<td>'
	str+='			<input onclick="DoubleOrNot()" type=image height=64px width=64px src="images/casino/cash.png"/>'
	str+='		</td>'
	str+='		<td>'
	str+='			Quitte ou Double ! : '+games[0].prize+ '€'
	str+='		</td>'
	str+='	</tr>'
	
	str+='	<tr>'
	str+='		<td id="bank_error"></td>'
	str+='		<td>'
	str+='			<input onclick="Bank('+games[1].prize+')" type=image height=64px width=64px src="images/casino/bank.png"/>'
	str+='		</td>'
	str+='		<td>'
	str+='		Banque :' +games[1].prize+ '€ (+1€/s)'
	str+='		</td>'
	str+='	</tr>'
	str+='</table>'

	$('#casino').append(str);
}