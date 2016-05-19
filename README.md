# polyTron 
Library for the detailed construction of multilayer neural networks.
##Technical details 

- Dynamical changes in neuronal size and layers.
- Ability to set the activation function of a neuron or a single layer.
- Ability to set "Rate" for the layer, or a single neuron.
- Function Accelerate learning network (Xmax) from a layer or a single neuron.
- Ability to complete their education network after training.
- Training made one instance at a time.
- Attribute "epoch" is missing, but it is easy to realize on stage learning network.
- A one-dimensional array of incoming data.
- Export, import of network connections in the JSON format.
- Ability to run a browser and server node.js. 

###Activation function
relu, log, abs, htan2, tanh, atan, sin, htan, gaus

##Using the example of the problem xor
###Use the browser

```html
<script src="/path/to/polytron.js"></script>
``` 

###Use the node.js
```javascript
var Polytron = require('/path/to/polytron.js').Polytron;
``` 
###Creating layers and object initialization:
In this embodiment, creates a common network with the sigmoid activation function (the log) and the total for all segments Rate (0.5)
```javascript
var layers=[
{"size":2, "model":"input",  "rate":0  , "active":"none"},
{"size":4, "model":"hidden", "rate":0.5, "active":"log"},
{"size":1, "model":"output", "rate":0.5, "active":"log"}
		   ];
``` 
You can set the output layer of the individual rate and individual activation function 
```javascript
var layers=[
{"size":2, "model":"input",  "rate":0  , "active":"none"},
{"size":4, "model":"hidden", "rate":0.5, "active":"log"},
{"size":1, "model":"output", "rate":0.1, "active":"relu"}
		   ];
``` 
You can also greatly accelerate the learning network by adding "Xmax" attribute, 
50 then how much will be multiplied by the correction rate for the maximum positive and negative values of the error  
```javascript
var layers=[
{"size":2, "model":"input",  "rate":0  , "active":"none"},
{"size":4, "model":"hidden", "rate":0.5, "active":"log", "Xmax":50},
{"size":1, "model":"output", "rate":0.1, "active":"relu"}
		   ];
``` 
The network supports the details of activation functions, rate, Xmax for each neuron ie
in this example, the network neurons will have different transfer functions as well as different steps and different acceleration factor
```javascript
var layers=[
{"size":2, "model":"input",  "rate":0  , "active":"none"},
{"size":5, "model":"hidden", "rate":[0.2,0.3,0.5,0.3,0.2], "active":["log","abs","tanh","abs","log"], "Xmax":[2,3,50,3,2]},
{"size":1, "model":"output", "rate":0.1, "active":"relu"}
		   ];
``` 
As the network has a function of demand deriving from a nearby neuron, ie the last value in the arrays extend to neurons last
```javascript
var layers=[
{"size":2, "model":"input",  "rate":0  , "active":"none"},
{"size":5, "model":"hidden", "rate":[0.2,0.3], "active":["abs","log"], "Xmax":[2,3]},
{"size":1, "model":"output", "rate":0.1, "active":"relu"}
		   ];
``` 

###Object initialization
```javascript
var nn = new Polytron(layers);
``` 

With the loading weights of the src (json) saved say after the first iteration

```javascript
var nn = new Polytron(layers);
nn.load(src);
``` 


###Training

```javascript
var inp=[];
inp[0]={input:[0, 0],target:[0.9]};
inp[1]={input:[0, 1],target:[0.5]};
inp[2]={input:[1, 0],target:[0.5]};
inp[3]={input:[1, 1],target:[0.9]};	//Prepare the training set
var epoch=1000; 				 	//Number of periods
var err_sum=0; 					 	//sum of errors
var minerror=0.0000000000000001; 	//Minimum error
var it=0; 						 	//Iterations travel
while(epoch>0){
	err_sum=0;
for(var i=0;i<inp.length;i++){
	var out=nn.forward(inp[i].input); 		 //Download an example of the network (before training)
	nn.backward(inp[i].input,inp[i].target); //training network
	err_sum+=nn.mse(inp[i].target,out);      //To summarize the difference
							 }
if(Math.abs(err_sum)<=minerror){break;}      //If the error sum is less than or equal to exit the loop
epoch--; it++;
			  }
```

###Export of weighting
After training, weight can be saved in a file or the container and then used for further studies
```javascript
var src = nn.toString();
```

###Validation output
```javascript
var out=nn.forward([1, 0]); //load example
console.log("target: 0.5"); //target 
console.log("input: "+[1, 0].join()); //input
console.log("out:"+out); 	//get output
```

## License
The MIT License (MIT)
Copyright (c) 2016 S.S.Korotaev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

