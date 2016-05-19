/**
The MIT License (MIT)
Copyright (c) 2016 S.S.Korotaev
*/

function Polylayer(layers,layer){
this.activations=['relu','log','abs','htan2','tanh','atan','sin','htan','asis','gaus'];
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
if(!util.isset(layers[this.layer].active)){layers[this.layer].active='none';}												
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
if(!util.isset(layers[this.layer].rate)){layers[this.layer].rate=0.0;}
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
Polylayer.prototype.attribute=function(i){
if(!this.active[i]){this.a='none';}else{this.a=this.active[i];}
if(!this.rate[i]){this.r=0;}else{this.r=this.rate[i];}
if(!this.Xmax[i]){this.x=1;}else{this.x=this.Xmax[i];}
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
for (var i = 0 ; i < input.length ; i++){						
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
var sum=0;	
for (var j = 0 ; j < this.s ; j++){
this.attribute(j);
  sum = 0;
    for (var i=0;input.length>i; i++) {sum += input[i] * this.w[i][j];}
    sum += this.w[input.length][j];
    this.o[j] = this.differentiate(sum);
									}	
												};

//----------------------------------------------------------------------
Polylayer.prototype.error=function(res){

switch(this.m){
case 'output':{
  for (var o = 0 ; o < this.s ; o++){//output  
	this.attribute(o);
	if(typeof(res)==="undefined"){
    this.e[o] = (1.0 - this.o[o]) * this.derivatives(this.o[o]);
    }else if(typeof(res)==="number"){
	this.e[o] = (res - this.o[o]) * this.derivatives(this.o[o]);	
		}else {		
	this.e[o] = (res[o] - this.o[o]) * this.derivatives(this.o[o]);
			  }
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
	case 'asis':{out=val;break;}
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
	case 'none':{break;}
	case 'asis':{out=val;break;}
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
this.Polylayer = Polylayer;
