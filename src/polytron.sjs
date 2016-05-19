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
