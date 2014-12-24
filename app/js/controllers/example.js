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
}

controllersModule.controller('ExampleCtrl', ExampleCtrl);




























(function() {
	var EraGraph;

	EraGraph = (function() {	
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

		function EraGraph(selector){
			this.selector = selector;
			this._array = this.parse_data(response);
			this.tooltip_legend = this.parse_data(response);
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
			
			var ageNames = d3.keys(this.tooltip_legend).filter(function(key) { return key !== "State"; });
			this.color.domain(d3.keys(this.tooltip_legend[ageNames[0]]).filter(function(key) { return key !== "State"; }).slice().reverse() )
			console.log(ageNames)

			this.tooltip = d3.select( "#chart1" )
			 			.append("div")
			 			.style("position", "absolute")
			 			.style("z-index", "10")
			 			.style("visibility", "hidden")
			 			.html("a simple tooltip <br>hello");

			this.moneyFormat = d3.format(".2s");



			this.svg = d3.select("#chart1").append("svg")
			    .attr("width", this.width + this.margin.left + this.margin.right)
			    .attr("height", this.height + this.margin.top + this.margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


			this.generate_axis();
		}

		EraGraph.prototype.generate = function(){
			console.log(this.margin)
			this.generate_axis();
		};

		EraGraph.prototype.generate_axis = function() {
			console.log('generate_axis');

			var xAxis = d3.svg.axis().scale(this.x).tickSize(0).tickPadding(6).orient("bottom");
			var yAxis = d3.svg.axis().scale(this.y).orient("left").tickFormat(d3.format(".2s"));
			this.svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Amount in USD");

			this.svg.append("g")
			    .attr("class", "x axis")
			    .attr("transform", "translate(0," + this.height + ")")
			    .call(xAxis)
			    .append("text")
				.attr("transform", "rotate(0)")
				.attr("x", this.width/2)
				.attr("y", 30)
				.attr("dx", ".9em")
				.style("text-anchor", "end")
				.text("Snapshot Date");
		};

		EraGraph.prototype.generate_legends = function(){
			var legend = this.svg.selectAll(".legend")
			.data(this.color.domain().slice().reverse())
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


			legend.append("rect")
			.attr("x", this.width - 10)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", this.color);

			legend.append("text")
			.attr("x", this.width - 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.text(function(d) { return d; });
		}

		EraGraph.prototype.parse_data = function(data){
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
		};

		EraGraph.prototype.get_legend_labels = function(data){
			console.log(data)
			var tooltip_legend = {};
			data.reduce(function(previousValue, currentValue, index, array) {
				var _x = {};
				_x[array[0][1]] = currentValue[1]
				_x[array[0][2]] = currentValue[2]
				_x[array[0][3]] = currentValue[3]
				tooltip_legend[currentValue[0]] = _x
			});

			return tooltip_legend;
		};

	 	return EraGraph;
  	})();

 	window.EraGraph = EraGraph
}).call(this);