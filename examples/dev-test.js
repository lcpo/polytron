var Polytron = require('../build/polytron.js').Polytron;
var layers=[
{"size":2, "model":"input",  "rate":0  , "active":"none"},
{"size":4, "model":"hidden", "rate":0.5, "active":"log","Xmax":50},
{"size":1, "model":"output", "rate":0.5, "active":"relu","Xmax":1}
		   ];
var nn = new Polytron(layers);
var inp=[];
inp[0]={input:[0, 0],target:[0.9]};
inp[1]={input:[0, 1],target:[0.5]};
inp[2]={input:[1, 0],target:[0.5]};
inp[3]={input:[1, 1],target:[0.9]};
var epoch=1000;
var err_sum=0;
var minerror=0.0000000000000001;
var it=0;
while(epoch>0){
	err_sum=0;
for(var i=0;i<inp.length;i++){
var out=nn.forward(inp[i].input);
	nn.backward(inp[i].input,inp[i].target);
	err_sum+=nn.mse(inp[i].target,out);
							 }
if(Math.abs(err_sum)<=minerror){break;}
		 
epoch--; it++;
}
console.log("error:"+err_sum.toFixed(16));
console.log("iterations:"+it);
console.log("-----------------------------------------------------------");	
var out=nn.forward([0, 0]);
console.log("target: 0.9");
console.log("input: "+[0, 0].join());
console.log("out:"+out);

console.log("-----------------------------------------------------------");
var out=nn.forward([0, 1]);
console.log("target: 0.5");
console.log("input: "+[0, 1].join());
console.log("out:"+out);
console.log("-----------------------------------------------------------");

var out=nn.forward([1, 0]);
console.log("target: 0.5");
console.log("input: "+[1, 0].join());
console.log("out:"+out);

console.log("-----------------------------------------------------------");
var out=nn.forward([1, 1]);
console.log("target: 0.9");
console.log("input: "+[1, 1].join());
console.log("out:"+out);
console.log("-----------------------------------------------------------");

