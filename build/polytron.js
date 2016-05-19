var util={};
//----------------------------------------------------------------------
util.end=function(arr){
if(arr){
return arr[arr.length-1];	
	}
return null;		
						};
//----------------------------------------------------------------------
util.isset=function(varname){
if(varname){
	return true;
}else{
if(varname==""){return true;}	
		}
return false;	
							};
//----------------------------------------------------------------------
util.max=function(array,index){
   var out= Math.max.apply( Math, array );
if(index){	
	return array.indexOf(out);
	}
return out;	
	};
//----------------------------------------------------------------------
util.min=function(array,index){
    var out = Math.min.apply( Math, array );
if(index){	
	return array.indexOf(out);
	}
return out;
	};
//----------------------------------------------------------------------
util.rand=function(mins, maxs){
  var argc = arguments.length;
  if (argc === 0) {
    mins = 0;
    maxs = 2147483647;
  } else if (argc === 1) {
    throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');
  }
  return Math.floor(Math.random() * (maxs - mins + 1)) + mins;	
	};
//----------------------------------------------------------------------
this.util = util;
function Polylayer(layers,layer){
this.activations=['relu','log','abs','htan2','tanh','atan','sin','htan','gaus'];
//relu,htan2,atan,sin,htan,gaus !!! val not 0
//log, abs,tanh -normal

this.w=[];				  //weights
this.o=[];				  //output sum
this.e=[];				  //error sum	

this.layers=layers;
this.layer=layer;
this.m=layers[layer].model;
this.s=layers[layer].size;

this.validateActivation(layers);
this.validateRate(layers);
this.validateXmax(layers);


	
										 }
//----------------------------------------------------------------------
Polylayer.prototype.validateActivation=function(layers){
if(typeof(layers[this.layer].active)==='string'){
this.active=[];	
for(var i=0;i<this.s;i++){
	if(layers[this.layer].active=='auto'){
	//!TODO: make automatic
	//!but for this it is necessary to know the priorities and level of abstraction, speed, accuracy of activation functions		
		}else
	if(layers[this.layer].active=='rand'){
	//!TODO: make a save / restore a random pattern	
//	this.active[i]=this.activations[util.rand(0,this.activations.length-1)];	
		}else{
	this.active[i]=layers[this.layer].active;
			}
	}
											}else{
if(layers[this.layer].active.length!=this.s){
this.active=[];	
for(var i=0;i<this.s;i++){ 
if(util.isset(layers[this.layer].active[i])){
	this.active[i]=layers[this.layer].active[i];
}else{
	this.active[i]=this.active[i-1]; //!previous spread
	}	
						  }	
	}else{
this.active=layers[this.layer].active;		
		}

												 }	
	};
//----------------------------------------------------------------------
Polylayer.prototype.validateRate=function(layers){

if(typeof(layers[this.layer].rate)==='string'){
//!TODO: make rateMax, rateMin, avto - automatic control of raid	
}else
if(typeof(layers[this.layer].rate)==='number'){
	this.rate=[];
for(var i=0;i<this.s;i++){this.rate[i]=layers[this.layer].rate;}	
										 }else{

if(layers[this.layer].rate.length!=this.s){
this.rate=[];	
for(var i=0;i<this.s;i++){ 
if(util.isset(layers[this.layer].rate[i])){
	this.rate[i]=layers[this.layer].rate[i];
}else{
	this.rate[i]=this.rate[i-1]; //!previous spread
	}	
						  }	
	}else{
this.rate=layers[this.layer].rate;		
		}

											 
											 
											 }

	};										 
//----------------------------------------------------------------------
Polylayer.prototype.validateXmax=function(layers){

if(typeof(layers[this.layer].Xmax)==='undefined'){
	this.Xmax=[];
for(var i=0;i<this.s;i++){this.Xmax[i]=1;}
}else
if(typeof(layers[this.layer].Xmax)==='number'){
	this.Xmax=[];
for(var i=0;i<this.s;i++){this.Xmax[i]=layers[this.layer].Xmax;}	
										 }else{

if(layers[this.layer].Xmax.length!=this.s){
this.rate=[];	
for(var i=0;i<this.s;i++){ 
if(util.isset(layers[this.layer].Xmax[i])){
	this.Xmax[i]=layers[this.layer].Xmax[i];
}else{
	this.Xmax[i]=this.Xmax[i-1]; //!previous spread
	}	
						  }	
	}else{
this.Xmax=layers[this.layer].Xmax;		
		}

											 
											 
											 }

	};										 

//----------------------------------------------------------------------
Polylayer.prototype.attribute=function(index){
if(!this.active[index]){this.a='none';}else{this.a=this.active[index];}
if(!this.rate[index]){this.r=0;}else{this.r=this.rate[index];}
if(!this.Xmax[index]){this.x=1;}else{this.x=this.Xmax[index];}
	};
//----------------------------------------------------------------------
Polylayer.prototype.prepare=function(input){
if(!util.isset(this.e)){this.e=[];}
if(!util.isset(this.o)){this.o=[];}
if(!util.isset(this.w)){this.w=[];}

if(this.e.length>this.s){this.e.length=this.s;} 
if(this.o.length>this.s){this.o.length=this.s;}
if(this.w.length>input.length){this.w.length=input.length;}
 
var il=0;	
for (var j = 0 ; j < this.s ; j++) {
this.attribute(j);
	il=input.length;
for (var i = 0 ; i < il ; i++){						
if(!util.isset(this.w[i])){this.w[i]=[];}
if(!util.isset(this.w[i][j])){this.w[i][j]=this.initw();}
if(this.w[i].length>this.s){this.w[i].length=this.s;}
										 }
if(!util.isset(this.w[input.length])){this.w[input.length]=[];} 
if(!util.isset(this.w[input.length][j])){ this.w[input.length][j]=0;}
if(this.w[input.length].length>this.s){this.w[input.length].length=this.s;}

if(!util.isset(this.o[j])){this.o[j] = 0;}
if(!util.isset(this.e[j])){this.e[j] = 0;}
															}
												 };
//----------------------------------------------------------------------
Polylayer.prototype.forward=function(input){
switch(this.m){
case 'maxout':{
 var max = input[0];
 this.o=0;
 var size=this.layers[this.layers.length-2].size;
  for (var i = 1; i < size; i++){
    if (input[i] > max) {max = input[i]; this.o = i;}
																	}
	break;
				}
default:{	
var sum=0;	
for (var j = 0 ; j < this.s ; j++){
this.attribute(j);
  sum = 0;
    for (var i=0;input.length>i; i++) {sum += input[i] * this.w[i][j];}
    sum += this.w[input.length][j];
    this.o[j] = this.differentiate(sum);
									}	
break;
}
				}
												};

//----------------------------------------------------------------------
Polylayer.prototype.errorSum=function(res,target){

switch(this.m){
case 'maxout':{
	break;
}	
case 'output':{
  for (var o = 0 ; o < this.s ; o++) {//output  
	this.attribute(o);
    this.e[o] = (target[o] - this.o[o]) * this.derivatives(this.o[o]);
														}
break;				
			   }
case 'hidden':{
  for (var h = 0; h < this.s; h++) {//hidden
	this.attribute(h);
    this.e[h] = 0;
    for (o = 0; o < res.s; o++) {//output
     this.e[h] += res.e[o] * res.w[h][o];
								}
    this.e[h] *= this.derivatives(this.o[h]);
									}

break;
				}
default:{break;}
				}				
return true;	
	};
//----------------------------------------------------------------------
Polylayer.prototype.update=function(res){
if(!res){return;}
var imax=util.max(this.e,true);
var imin=util.min(this.e,true);
if(this.e[imin]>0){imin=-1;}


	switch(this.m){
case 'output':case 'hidden':{	
var r=0;	
for (var o = 0 ; o < this.s ; o++){//output
this.attribute(o);
r=this.r;
if(imin==o){r=this.r*this.x;}
if(imax==o){r=this.r*this.x;}
for (var h = 0 ; h < res.s; h++){//hidden
this.w[h][o] += (r * this.e[o] * res.o[h]);    
								 }
this.w[res.s][o] += (r * this.e[o]);

    
									}	
break;
}
default:{break;}
}	
	};
//----------------------------------------------------------------------
Polylayer.prototype.initw=function(){
var out=0;
switch(this.a){
	case 'none':{break;}
	case 'log':	case 'abs': case 'tanh':
	case 'sin':	case 'atan':case 'gaus':
	case 'htan2': case 'ramp':case 'relu':{out=((util.rand() / 2147483647) - 0.5);break;} 
	case 'htan':{ out=Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()); break;}
	default:{out=((util.rand() / 2147483647) - 0.5);}					
}
return out;	
	};
//----------------------------------------------------------------------
Polylayer.prototype.differentiate=function(val,leak){
if(!leak){leak=0;}
var out=0;
switch(this.a){
	case 'none':{break;}
	case 'log':{out=(1 / (1 + Math.exp(-val)));break;}
	case 'abs':{out = (0.5 * (val / (1 + Math.abs(val))) + 0.5); break;}
	case 'tanh':{out=((0.5* Math.tanh(val))+0.5); break;}
	case 'htan':{var e=Math.exp(2 * val); out=(e - 1) / (e + 1); break;}
	case 'sin':{out=Math.sin(val);break;}
	case 'gaus':{out=Math.exp(-Math.pow(val, 2));break;}
	case 'atan':{out=Math.atan(val);break;}
	case 'htan2':{out=(Math.exp(val) - Math.exp(-val)) / (Math.exp(val) + Math.exp(-val));break;}
	case 'relu':{if(val<0){out=0;}else{out=val;}break;} //Relu
	case 'ramp':{if(val<0){out=(leak * val);}else{out=val;}break;} //Ramp
						}
return out;	
	
	};
//----------------------------------------------------------------------
Polylayer.prototype.derivatives=function(val,leak){
if(!leak){leak=0;}
var out=0;
switch(this.a){
	case 'log':	case 'abs':case 'tanh':{out=( val * (1 - val) );break;}
	case 'htan':{var e=Math.exp(2 * val);out= (1 - Math.pow((e - 1) / (e + 1), 2));break;}
	case 'sin':{out=(Math.cos(val));break;}
	case 'gaus':{out=(-2 * val * val); break;}
	case 'atan':{out=(1 / (Math.pow(val, 2) + 1));break;}
	case 'htan2':{out=(1 - Math.pow(val, 2)); break;}
	case 'relu':{if(val < 0) {out=0;}else{out=1;}break;} //Relu
	case 'ramp':{if(val < 0) {out=leak;}else{out=1;}break;} //Ramp
						}	
return out;	
													};
//----------------------------------------------------------------------
//Polylayer.prototype.toJSON=function(){};
//----------------------------------------------------------------------
//Polylayer.prototype.fromJSON=function(){};
//----------------------------------------------------------------------
this.Polylayer = Polylayer;
function Polytron(layers,defrate,defactie,defmodel,defrateMax,defrateMin){
if(Object.prototype.toString.call(layers[0])==='[object Number]'){
var nlayers=[];
if(!defmodel){
	defmodel=[];
for(var key in layers){
	if(key==0){defmodel[key]='input';}else
	if(key==layers.length-1){defmodel[key]='output';}else{
	defmodel[key]='hidden';	
		}
	}
}

for(var key in layers){
	nlayers[key]={};
	nlayers[key].size=layers[key];
	nlayers[key].model=defmodel[key];
	
if(typeof(defrate)==='number'){nlayers[key].rate=defrate;}else
if(typeof(defrate)==='string'){
	if(defrate=='auto'){nlayers[key].rate=defrate;nlayers[key].maxrate=defrateMax;nlayers[key].minrate=defrateMin;}
	}else{nlayers[key].rate=defrate[key];}

if(typeof(defactie)==='string'){nlayers[key].active=defactie;}else{nlayers[key].active=defactie[key];}
	
	}	
layers=nlayers;																	
																	}
this.nl=[];
this.layers=layers;
this.w=[];				  //weights
this.o=[];				  //output sum
this.e=[];				  //error
												};
//----------------------------------------------------------------------
Polytron.prototype.forward=function(input){

var pinput=input;
if(this.e.length>this.layers.length){this.e.length=this.layers.length;} 
if(this.w.length>this.layers.length){this.w.length=this.layers.length;}
if(this.o.length>this.layers.length){this.o.length=this.layers.length;} 

var sum=0;
var len=this.layers.length;	
var l=0
while(l<len){
if(!util.isset(this.nl[l])){this.nl[l]=new Polylayer(this.layers,l);}
if(l==0){this.nl[l].o=input;}
if(l>0){
	this.nl[l].prepare(pinput); pinput=this.nl[l].o;
	this.nl[l].forward(input); input=this.nl[l].o;
	   }

l++;		}
										  
var o=util.end(this.nl);
return o.o; 
													};
//----------------------------------------------------------------------
Polytron.prototype.backward=function(input,target){
var res=null;
var len=this.layers.length-1;

for(var l = len ; l >0 ;l--){
if(this.nl[l+1]){res=this.nl[l+1];}else{res=null;}
this.nl[l].errorSum(res,target);
							 }
res=null;

for(var l = len ; l >0 ;l--){
if(this.nl[l-1]){res=this.nl[l-1];}else{res=null;}
this.nl[l].update(res);
  							 }
														};
//----------------------------------------------------------------------
Polytron.prototype.mse=function(target,output){
if(!output){output=util.end(this.o);}
var size=this.layers[this.layers.length-1].size;
    var err = 0;
    for (i = 0 ; i < size; i++) {
      err +=  (target[i] - output[i])*(target[i] - output[i]); 
    }
    err =util.end(this.layers).rate * err;
return err;    	
							};
//----------------------------------------------------------------------
Polytron.prototype.make_target=function(key){	
		var target = [];
		var i = 0;
		var size=this.layers[this.layers.length-1].size
		while(i < size) {
			target[i] = (i === key)?1:0;
		i++;
		}
		return target;	
	};
//----------------------------------------------------------------------

Polytron.prototype.action=function(vector){ //maxout
var max=0; var sel = 0; var max = vector[sel];
var size=this.layers[this.layers.length-1].size;
  for (var index = 1; index < size; index++) {
    if (vector[index] > max) {max = vector[index]; sel = index;}
  }
  return sel;
								};
//----------------------------------------------------------------------
Polytron.prototype.toJSON=function(){
for (var key in this.nl){
	this.w[key]=this.nl[key].w;
	this.o[key]=this.nl[key].o;
	this.e[key]=this.nl[key].e;
}	
this.o[0]=[];
var the={};
the.w=this.w;
the.o=this.o; 
the.e=this.e;
return the;
										};
//----------------------------------------------------------------------
Polytron.prototype.fromJSON=function(t){
if(util.isset(t)){
if(util.isset(t['w'])){this.w=t['w'];}
if(util.isset(t['o'])){this.o=t['o'];}
if(util.isset(t['e'])){this.e=t['e'];}
var len=this.layers.length;
for(var l = 0 ; l < len;l++){ 

if(!util.isset(this.nl[l])){
	this.nl[l]=new Polylayer(this.layers,l);
	this.nl[l].w=this.w[l];
	this.nl[l].o=this.o[l];
	this.nl[l].e=this.e[l];							  
							  }else{
	this.nl[l].w=this.w[l];
	this.nl[l].o=this.o[l];
	this.nl[l].e=this.e[l];							  

								  }
											}
						}
	};
//----------------------------------------------------------------------
Polytron.prototype.toString=function(){
	return JSON.stringify(this.toJSON());
	};
//----------------------------------------------------------------------
Polytron.prototype.load=function(src){
if(src.length>0){this.fromJSON(JSON.parse(src));}	
									   };
//----------------------------------------------------------------------

  if (typeof(module) === 'undefined' || typeof(module.exports) === 'undefined') {
    window.Polytron = Polytron; 
  } else {
    module.exports.Polytron = Polytron; 
  }
	this.Polytron = Polytron;
