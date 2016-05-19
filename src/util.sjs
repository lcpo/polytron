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
