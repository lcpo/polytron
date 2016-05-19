//----------------------------------------------------------------------
var max = function(){
    return Math.max.apply( Math, arguments[0]);
};
//----------------------------------------------------------------------	 
var min = function(){
    return Math.min.apply( Math, arguments[0]);
};
//----------------------------------------------------------------------
var array_search=function( needle, haystack, strict ) {	
	// Searches the array for a given value and returns the corresponding key if
	// successful
	// 
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	var strict = !!strict;
	for(var key in haystack){
		if( (strict && haystack[key] === needle) || (!strict && haystack[key] == needle) ){
			return key;
		}
	}
	return false;
}
//----------------------------------------------------------------------
var shuffle=function(o){ 
    for(var j, x, k = o.length; k; j = Math.floor(Math.random() * k), x = o[--k], o[k] = o[j], o[j] = x);
    return o;
}
//----------------------------------------------------------------------
function num_series(size,arr){
var learnData=[];
var targetData=[];
for(var i=0;i<arr.length;i++){
var inp=[];	
for(var n=0;n<size;n++){	
if(arr[i+n]){if(arr[i+n]==''){break;} inp[n]=parseFloat(arr[i+n]); }
}
if(arr[i+n]){ 
if(arr[i+n]==''){break;}	
targetData[i]=[parseFloat(arr[i+n])];	
	}else{
break;		
		}
if(size==inp.length){learnData[i]=inp;}
}

return {'learnData':learnData,'targetData':targetData};

							}
//----------------------------------------------------------------------
function main_training(){
var layers=JSON.parse($("#template").val());
var pd=new PrepareData();
var nn=new Polytron(layers);
var src=$("#memory").val();
nn.load(src);

var buffer='<pre>';

var inplen=layers[0].size;
var minerror=parseFloat($("#minerror").val());
var epoch=parseInt($("#epoch").val());
var data=[];
var out=[];
var tar=[];
var sum=0;
var err_arr=[];
var okey=-1;
var e=0; 
var z=0; 
var ekey=0;
var yer=$("#training_yer").val();
var arr=dollar_ruble[yer];
var ns=num_series(inplen,arr);
var learnData=pd.encode(ns.learnData);
var targetData=pd.encode(ns.targetData);
for(var key in learnData){data[key]={'learn':learnData[key],'target':targetData[key]};}

for (var e = 0; e < epoch; e++){
	sum=0; z=0;
for(var key in data){
var o=nn.forward(data[key].learn);
out[key]=pd.decode_one(o[0]).toFixed(4);
tar[key]=pd.decode_one(data[key].target[0]).toFixed(4);
err_sum+=parseFloat(Math.abs(data[key].target[0]-o[0]));
err_arr[key]=parseFloat(Math.abs(tar[key]-out[key]));
//buffer+=("i="+z+" | err="+(Math.abs(o[0]-data[key].target[0])).toFixed(12)+" | proc="+Math.round((sum / data.length) * 100)+"%|0="+out[key]+"|t="+tar[key]+" | ");
//buffer+=("<br>");

if(parseFloat(Math.abs(tar[key]-out[key]))<=minerror){
sum++
}else{z++;sum--; }
nn.backward(data[key].learn,data[key].target);

 
						}


								}
								
								
buffer+=("examples count="+(data.length-1)+" | wrong answers="+z+"<br>");
buffer+=("sum error="+err_sum+"|"+((err_sum>old_err_sum)?'<img src="arrow-up.png">':'<img src="arrow-down.png">')+"<br>");
if((err_sum>=old_err_sum)){
$("title").html('&#8593;|'+tproc+'|b:'+z+'|'+timer);	//up
	}else{
$("title").html('&#8595;|'+tproc+'|b:'+z+'|'+timer);	//down	
		}
	
$("#memory").val(nn.toString()); //save memory

if(err_sum!=old_err_sum){old_err_sum=err_sum;}
err_sum=0;
var mi=min(err_arr);
var ma=max(err_arr);
var minkey=array_search(mi,err_arr);
var maxkey=array_search(ma,err_arr);

buffer+=("err_min:|id="+minkey+"|out="+out[minkey]+"|tar="+tar[minkey]+"|err="+mi+"<br>");
buffer+=("err_max:|id="+maxkey+"|out="+out[maxkey]+"|tar="+tar[maxkey]+"|err="+ma+"<br>");
if(okey!=-1){
buffer+=("ok:|0="+out[okey]+"|t="+tar[okey]+"<br>");	
	}
	

sum=0;
out=[];
tar=[];
for(var key in data){
var o=nn.forward(data[key].learn);
out[key]=pd.decode_one(o[0]).toFixed(4);
tar[key]=pd.decode_one(data[key].target[0]).toFixed(4);
if(parseFloat(Math.abs(tar[key]-out[key]))<=minerror){
sum++
}else{sum--;}
}

buffer+=("<b>Network is "+((sum / (data.length-1)) * 100).toFixed(3)+"% correct</b><br>");
tproc=((sum / (data.length-1)) * 100).toFixed(3)+"%";

buffer+=('</pre>');
$("#out").html(buffer);
$("#timer").html(timer);

if(((sum / (data.length-1)) * 100).toFixed(3)==100){	
clearInterval(window.Interval1);
}




timer++;

	}	
//----------------------------------------------------------------------
