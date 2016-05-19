

//----------------------------------------------------------------------
		var lineChartData = {
			labels : [],
			datasets : [
				{
					label: "real",
					fillColor : "rgba(151,187,205,0.01)",
					strokeColor : "red",
					pointColor : "darkred",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "midnightred",
					data : []
				},
				{
					label: "net",
					fillColor : "rgba(220,220,220,0.01)",
					strokeColor : "blue",
					pointColor : "darkblue",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "midnightblue",
					data : []
				}												
			]

		}
//----------------------------------------------------------------------
function getAllCount(){
var layers=JSON.parse($("#template").val());
var yer=$("#test_yer").val();
var ns=num_series(layers[0].size,dollar_ruble[yer]);
return ns.targetData.length-1;
						}
//----------------------------------------------------------------------
function getRealrate(index){
var layers=JSON.parse($("#template").val());	
var yer=$("#test_yer").val();
var ns=num_series(layers[0].size,dollar_ruble[yer]);
return [ns.targetData[index][0]];
	                 }
//----------------------------------------------------------------------
function getNetrate(index){
var layers=JSON.parse($("#template").val());
var yer=$("#test_yer").val();
var ns=num_series(layers[0].size,dollar_ruble[yer]);
var pd=new PrepareData();
var nn=new Polytron(layers);
var src=$("#memory").val();
nn.load(src);
var learnData=pd.encode(ns.learnData);
var o=nn.forward(learnData[index]);
return [pd.decode_one(o[0]).toFixed(4)];
			
	}
//----------------------------------------------------------------------
function main_test(){
var allcount=getAllCount();
window.myLine.addData([null,null], " ");//window.index
var index0=window.myLine.datasets[0].points.length-1;
var index1=window.myLine.datasets[1].points.length-1;
window.myLine.datasets[0].points[index0].value = getRealrate(window.index)[0];
window.myLine.datasets[1].points[index1].value = getNetrate(window.index)[0];
window.myLine.update();

	
//if(window.counter>100){window.myLine.removeData();}
window.counter++; window.index++;
if((window.index%allcount)==0){window.index=0;stop_test();}
	}
//----------------------------------------------------------------------
window.counter=0;
window.index=0;

	
