var Int;
var One=true;
function Chrono(){
    var MSec=parseInt(Ext(GetEle($('#chrono').text(),3)));
    var Sec=parseInt(Ext(GetEle($('#chrono').text(),2)));
	var Min=parseInt(Ext(GetEle($('#chrono').text(),1)));
	var He=parseInt(Ext(GetEle($('#chrono').text(),0)));
	if(MSec<100){
	  MSec++;
	  }
	  else{
	      Sec++;MSec=0;
		  if(Sec>60){
	        Min++;Sec=0;
	          if(Min>60){
                 He++;Min=0;
				 }			  
		   }
		  }
		 
	 $('#chrono').text(Trans(He)+":"+Trans(Min)+":"+Trans(Sec)+":"+Trans(MSec));
	
  }
  function Ext(s){
	var s_=parseInt(s.substring(1,s.length));
	if(parseInt(s)<10){
	   return parseInt(s_);
	   }else{
	     return s;
		 }
	}
  function GetEle(s,i){
    var Ele=new Array();
	var s_=s+":";
	var j;
	var m=0;
	var s__="";
	for (j=0;j<s_.length;j++){
	if(s_.charAt(j)!=":"){
	    s__=s__+s_.charAt(j);
		}else{
		  Ele[m]=s__;
		  s__="";m++;
		  }
	 }
		  return Ele[i];
	}
	function Trans(i){
	 if(i<10){
	   return "0"+i;
	   }else{
          return i;
		  }	 
	}
	
	function InitChrono()
	{	 
	 if(One){
	   Int=setInterval("Chrono()",10);
	   One=false;
	   }else{
	     clearInterval(Int);
		 One=true;
		}
	}