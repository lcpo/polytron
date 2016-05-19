function PrepareData(dataHigh,dataLow,normalizedHigh,normalizedLow){
if(dataHigh){this.dataHigh=dataHigh;}else{this.dataHigh=100;}
if(dataLow){this.dataLow=dataLow;}else{this.dataLow=0;}
if(normalizedHigh){this.normalizedHigh=normalizedHigh;}else{this.normalizedHigh=1;}
if(normalizedLow){this.normalizedLow=normalizedLow;}else{this.normalizedLow=0;}	
																	}

//----------------------------------------------------------------------
PrepareData.prototype.encode_one=function(x){
return ((x - this.dataLow) / (this.dataHigh - this.dataLow)) * (this.normalizedHigh - this.normalizedLow) + this.normalizedLow;
										   };
//----------------------------------------------------------------------										   
PrepareData.prototype.decode_one=function(x){
return (((this.dataLow - this.dataHigh) * x - this.normalizedHigh * this.dataLow + this.dataHigh * this.normalizedLow) / (this.normalizedLow - this.normalizedHigh));
										   };										   
//----------------------------------------------------------------------
PrepareData.prototype.encode=function(arrX){
var arr=new Array(arrX.length);
for(var key in arrX){
	if(!arr[key]){arr[key]=[];}
	for(var k in arrX[key]){arr[key][k]=this.encode_one(arrX[key][k]);}
	}
return arr;	
											  };
//----------------------------------------------------------------------											  
PrepareData.prototype.decode=function(arrX){
var arr=new Array(arrX.length);	
for(var key in arrX){
	if(!arr[key]){arr[key]=[];}
	for(var k in arrX[key]){arr[key][k]=this.decode_one(arrX[key][k]);}
	}
return arr;	
	};										   
//----------------------------------------------------------------------
this.PrepareData=PrepareData;
