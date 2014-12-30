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


	var g = new EraGraph(response,'#chart1');
}

controllersModule.controller('ExampleCtrl', ExampleCtrl);



























(function(d3) {
	var EraGraph;

	EraGraph = (function() {	
		function EraGraph(response, selector){
			addSelect(selector);
			this.selector = selector;
			this._array = this.parse_data(response);
			this.tooltip_legend = this.get_legend_labels(response);
			
			var stack = d3.layout.stack();
			this.layers = stack( this._array );

			this.yGroupMax = d3.max(this.layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); });
			this.yStackMax = d3.max(this.layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });


			var widthX = document.getElementById(this.selector.replace('#','')).offsetWidth;
			var heightX = document.getElementById(this.selector.replace('#','')).offsetHeight;

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
			//this.color = d3.scale.linear().domain([0, n - 1]).range(["#556","#aad" ]);
			var ageNames = d3.keys(this.tooltip_legend).filter(function(key) { return key !== "State"; });
			this.color.domain(d3.keys(this.tooltip_legend[ageNames[0]]).filter(function(key) { return key !== "State"; }).slice().reverse() )
			

			this.tooltip = d3.select( this.selector )
			 			.append("div")
			 			.style("position", "relative")
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
			this.generate_bars();
			this.generate_legends();
		}


		EraGraph.prototype.generate_bars = function(){
			var x = this.x;
			var y = this.y;
			var n = this.layers.length;
			var yStackMax = this.yStackMax;
			var yGroupMax = this.yGroupMax;
			var height = this.height;
			var divID = this.selector;
			var color = this.color;
			var tooltip_legend = this.tooltip_legend;
			var tooltip = this.tooltip;
			var layer = this.svg.selectAll(".layer")
			    .data(this.layers)
			  .enter().append("g")
			    .attr("class", "layer")
			    .style("fill", function(d, i) { return color(d[i].category); });
			var rect = layer.selectAll("rect")
			    .data(function(d) { return d; })
			  .enter().append("rect")
			    .attr("x", function(d) {  return x(d.total); })
			    .attr("y", this.height)
			    .attr("width", x.rangeBand())
			    .attr("height", 0)
			.on("mouseover", function(d){
				var html = '';
				for(var key in tooltip_legend[d.total]) {
					html+= '<span style="color:' + color(key) +'">' + key + ': ' + tooltip_legend[d.total][key] + ' </span>';
				}
				tooltip.html('<div class="graph-tooltip">Snapshot Date: ' + d.total + '<br/>' + html + '</div>')
				return tooltip.style('visibility', 'visible');
			})
			.on("mousemove", function(){console.log(event.pageY-10, event.pageX+10 ); return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			.on("mouseout", function(){return tooltip.style("visibility", "hidden");})

			rect.transition()
			    .delay(function(d, i) { return i * 10; })
			    .attr("y", function(d) { return y(d.y0 + d.y); })
			    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

			d3.selectAll(divID + " input").on("change", change);

			var timeout = setTimeout(function() {
				d3.select(divID + " input[value=\"grouped\"]").property("checked", true).each(change);
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
		};

		EraGraph.prototype.generate_axis = function() {
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
		};

		EraGraph.prototype.parse_data = function(data){
			var _array = [[],[],[]];
			data.reduce(function(previousValue, currentValue, index, array) {
				_array[2].push({
					total 	 : 	currentValue[0],
					y 		 :  currentValue[1],
					category : 	array[0][1]
				} );
				_array[1].push( {
					total 	 : 	currentValue[0],
					y 		 :  currentValue[2],
					category : 	array[0][2]
				} );

				_array[0].push({
					total 	 : 	currentValue[0],
					y 		 :  currentValue[3],
					category : 	array[0][3]
				});
			});
			return _array;
		};

		EraGraph.prototype.get_legend_labels = function(data){
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

		function addSelect(divId){
			var innerHTML = '<form>'+
							  '<label><input type="radio" name="mode" value="grouped"> Grouped</label>'+
							  '<label><input type="radio" name="mode" value="stacked" checked> Stacked</label>'+
							'</form>';
			d3.select( divId )
	 			.append("div")
	 			.style("position", "absolute")
	 			.style("z-index", "10")
	 			.html(innerHTML);
		}


	 	return EraGraph;
  	})();

 	window.EraGraph = EraGraph
})(d3);