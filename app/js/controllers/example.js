'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
 function ExampleCtrl(D3graph) {

	var response = [
		["snapshot_date", "Notion Total", "RWA Total", "Expected Loss Total"],
		["2014-01-01", 98, 8, 4.8],
		["2013-12-01", 27, 8, 4.0],
		["2013-11-01", 47, 7, 4.8],
		["2013-10-01", 56, 7, 4.0],
		["2013-09-01", 46, 8, 4.8],
		["2013-08-01", 45, 6, 4.0],
		["2013-07-01", 1, 7, 4.8],
		["2013-06-01", 1, 7, 74.0],
	];

	// var json_data = [];
	// response.reduce(function(previousValue, currentValue, index, array) {
	// 	var t = {};
	// 	t[array[0][0]] = currentValue[0]
	// 	t[array[0][1]] = currentValue[1]
	// 	t[array[0][2]] = currentValue[2]
	// 	t[array[0][3]] = currentValue[3]
	// 	json_data.push(t)
	//   return;
	// });

	// console.log("--------");
	// console.log(json_data);
	// console.log("--------");

	//D3graph.generate(json_data, 'stacked', '#chart1')

var _array = [[],[],[]];
var tooltip_legend = {};
///////---------------///////////
response.reduce(function(previousValue, currentValue, index, array) {
			var t = {};
			t.total = currentValue[0];
			t.y = currentValue[1];
			t.category = array[0][1];
			_array[2].push(t);

			var t = {};
			t.total = currentValue[0];
			t.y = currentValue[2]
			t.category = array[0][2];
			_array[1].push(t);

			var t = {};
			t.total = currentValue[0];
			t.y = currentValue[3]
			t.category = array[0][3];
			_array[0].push(t);

			var _x = {};
			_x[array[0][1]] = currentValue[1]
			_x[array[0][2]] = currentValue[2]
			_x[array[0][3]] = currentValue[3]
			tooltip_legend[currentValue[0]] = _x

});


var n = 3, // number of layers
    m = 8, // number of samples per layer
    stack = d3.layout.stack(),
    layers = stack( _array ),
    yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });


var widthX = document.getElementById('chart1').offsetWidth;
var heightX = document.getElementById('chart1').offsetHeight;

var margin = {top: 40, right: 20, bottom: 40, left: 35},
    width = widthX - margin.left - margin.right,
    height = heightX - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .domain( _array[0].map(function(d){ return d.total;}).slice().reverse() )
    .rangeRoundBands([10, width], .08);


var y = d3.scale.linear()
    .domain([0, yStackMax])
    .range([height, 0]);

var color = d3.scale.ordinal().range(["#a05d56","#8a89a6","#98abc5" ]);
window.color = color;
var tooltip = d3.select( "#chart1" )
 			.append("div")
 			.style("position", "absolute")
 			.style("z-index", "10")
 			.style("visibility", "hidden")
 			.html("a simple tooltip <br>hello");

var moneyFormat = d3.format(".2s");

var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(0)
    .tickPadding(6)
    .orient("bottom")
var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));



var svg = d3.select("#chart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
.attr("class", "y axis")
.call(yAxis)
.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 6)
.attr("dy", ".71em")
.style("text-anchor", "end")
.text("Amount in USD");



var layer = svg.selectAll(".layer")
    .data(layers)
  .enter().append("g")
    .attr("class", "layer")
    .style("fill", function(d, i) { return color(d[i].category); });









var rect = layer.selectAll("rect")
    .data(function(d) { return d; })
  .enter().append("rect")
    .attr("x", function(d) {  return x(d.total); })
    .attr("y", height)
    .attr("width", x.rangeBand())
    .attr("height", 0)
	.on("mouseover", function(d){
		var html = '';
		for(var key in tooltip_legend[d.total]) {
			console.log(d.category)
			html+= '<span style="color:' + color(key) +'">' + key + ': ' + tooltip_legend[d.total][key] + ' </span>';
		}
		tooltip.html('<div class="graph-tooltip">Snapshot Date: ' + d.total + '<br/>' + html + '</div>')
		return tooltip.style('visibility', 'visible');
	})
	.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	.on("mouseout", function(){return tooltip.style("visibility", "hidden");})

rect.transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
	.attr("transform", "rotate(0)")
	.attr("x", width/2)
	.attr("y", 30)
	.attr("dx", ".9em")
	.style("text-anchor", "end")
	.text("Snapshot Date");

d3.selectAll("input").on("change", change);


// console.log(layers)
var ageNames = d3.keys(tooltip_legend).filter(function(key) { return key !== "State"; });
color.domain(d3.keys(tooltip_legend[ageNames[0]]).filter(function(key) { return key !== "State"; }).slice().reverse() )
console.log(ageNames)


var legend = svg.selectAll(".legend")
	.data(color.domain().slice().reverse())
	.enter().append("g")
	.attr("class", "legend")
	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


	legend.append("rect")
	.attr("x", width - 10)
	.attr("width", 18)
	.attr("height", 18)
	.style("fill", color);

	legend.append("text")
	.attr("x", width - 24)
	.attr("y", 9)
	.attr("dy", ".35em")
	.style("text-anchor", "end")
	.text(function(d) { console.log(d);return d; });

var timeout = setTimeout(function() {
  d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
}, 2000);

function change() {
  clearTimeout(timeout);
  if (this.value === "grouped") transitionGrouped();
  else transitionStacked();
}

function transitionGrouped() {
  y.domain([0, yGroupMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d, i, j) { return x(d.total) + x.rangeBand() / n * j; })
      .attr("width", x.rangeBand() / n)
    .transition()
      .attr("y", function(d) { return y(d.y); })
      .attr("height", function(d) { return height - y(d.y); });
}

function transitionStacked() {
  y.domain([0, yStackMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .transition()
      .attr("x", function(d) { return x(d.total); })
      .attr("width", x.rangeBand());
}

// Inspired by Lee Byron's test data generator.
function bumpLayer(n, o) {

  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < n; i++) {
      var w = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }

  var a = [], i;
  for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
  
  for (i = 0; i < 5; ++i) bump(a);
  //console.log(a);
  return a.map(function(d, i) { return {total: i, y: Math.max(0, d)}; });
}

}

controllersModule.controller('ExampleCtrl', ExampleCtrl);




























(function() {
	var EraGraph;

	EraGraph = (function() {
		function EraGraph(selector){
			this.selector = selector;
			this._array = [[]];
			var n = 3; // number of layers
			var m = 8; // number of samples per layer
			var stack = d3.layout.stack();
			this.layers = stack( this._array );
			this.yGroupMax = d3.max(this.layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); });
			this.yStackMax = d3.max(this.layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });
			this.options = 0;

			var widthX = document.getElementById(this.selector).offsetWidth;
			var heightX = document.getElementById(this.selector).offsetHeight;

			this.margin = {top: 40, right: 20, bottom: 40, left: 35};
			this.width = widthX - this.margin.left - this.margin.right;
			this.height = heightX - this.margin.top - this.margin.bottom;

			this.x = d3.scale.ordinal()
			    .domain( this._array[0].map(function(d){ return d.total;}).slice().reverse() )
			    .rangeRoundBands([10, this.width], .08);


			this.y = d3.scale.linear()
			    .domain([0, this.yStackMax])
			    .range([this.height, 0]);

			this.color = d3.scale.ordinal().range(["#a05d56","#8a89a6","#98abc5" ]);
			
			this.tooltip = d3.select( "#chart1" )
			 			.append("div")
			 			.style("position", "absolute")
			 			.style("z-index", "10")
			 			.style("visibility", "hidden")
			 			.html("a simple tooltip <br>hello");

			this.moneyFormat = d3.format(".2s");
		}

		EraGraph.prototype.generate = function(){
			console.log(this.margin)
			this.generate_axis();
		};

		EraGraph.prototype.generate_axis = function() {
			console.log('generate_axis');

			this.xAxis = d3.svg.axis().scale(this.x).tickSize(0).tickPadding(6).orient("bottom");
			this.yAxis = d3.svg.axis().scale(this.y).orient("left").tickFormat(d3.format(".2s"));
		};

	 	return EraGraph;
  	})();

 	window.EraGraph = EraGraph
}).call(this);