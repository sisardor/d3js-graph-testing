'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
 function ExampleCtrl() {

var response = [
	["snapshot_date", "Notion Total", "RWA Total", "Expected Loss Total"],
	["2014-01-01", 1811525600, 813964253.071942, 45563563.064588],
	["2013-12-01", 1795494400, 808785471.794322, 45160345.69235],
	["2013-11-01", 1763432000, 797317414.245194, 44353910.947878],
	["2013-10-01", 1603120000, 739977126.499504, 40321737.22534],
	["2013-09-01", 1611525600, 813564213.071942, 45563563.064588],
	["2013-08-01", 1595494400, 612785471.794322, 45160345.69235],
	["2013-07-01", 173432000, 797317414.245194, 44353410.947878],
	["2013-06-01", 123120000, 739977126.499504, 947321737.22534],
];

 var json_data = [];
response.reduce(function(previousValue, currentValue, index, array) {
	var t = {};
	t[array[0][0]] = currentValue[0]
	t[array[0][1]] = currentValue[1]
	t[array[0][2]] = currentValue[2]
	t[array[0][3]] = currentValue[3]
	json_data.push(t)
  return;
});

var graph = new EraGraph(json_data, 'grouped', '#chart1');
graph.drawGraph();


var graph = new EraGraph(json_data, 'stacked', '#chart2');
graph.drawGraph();



}

controllersModule.controller('ExampleCtrl', ExampleCtrl);

function EraGraph(json_data, type, selector) {
	this.json_data = JSON.parse(JSON.stringify(json_data));
	this.type = type;
	this.selector = selector;


	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width  = 460 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
	    .range([height, 0]);

	var color = d3.scale.ordinal()
	    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickFormat(d3.format(".2s"));

	var svg = d3.select( this.selector ).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var tooltip = d3.select( this.selector )
	    .append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.html("a simple tooltip <br>hello");

	var moneyFormat = d3.format(".2s");
	


	this.drawGraph = function() {
		if (this.type === 'stacked') {
			color.domain(d3.keys(this.json_data[0]).filter(function(key) { return key !== "snapshot_date"; }).slice().reverse() )

			  	this.json_data.forEach(function(d){
				  	var y0 = 0;
				  	d.amount = color.domain().map(function(name) {
				  		return {name: name, y0:y0, y1:y0 += +d[name], value: d[name] }
				  	});
				  	d.total = d.amount[d.amount.length - 1].y1;
			  	})

				this.json_data.sort(function(a, b) { return new Date(a.snapshot_date) - new Date(b.snapshot_date) ; });
			  	x.domain(this.json_data.map(function(d) {return d.snapshot_date; }));

			  	y.domain([0, d3.max(this.json_data, function(d) { return d.total; })]);

			  svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis);

			  svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis)
			    .append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 6)
			      .attr("dy", ".71em")
			      .style("text-anchor", "end")
			      .text("Amount in USD");

			  var state = svg.selectAll(".state")
			      .data(this.json_data)
			    .enter().append("g")
			      .attr("class", "g")
			      .attr("transform", function(d) { return "translate(" + x(d.snapshot_date) + ",0)"; })
			      .on("mouseover", function(d){
			        var html = "";
			     	var i =  d.amount.length;
			        while(i--) {
			          html+= "<span style=\"color:" + color(d.amount[i].name)+"\">" + d.amount[i].name + ": " + moneyFormat(d.amount[i].value) + " </span>"
			        };
			        tooltip.html("<div class=\"graph-tooltip\">Assessment Date: " + d.snapshot_date + "<br/>" + html + "</div>")
			        return tooltip.style("visibility", "visible");})
			      .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			      .on("mouseout", function(){return tooltip.style("visibility", "hidden");})

			  state.selectAll("rect")
			      .data(function(d) { return d.amount; })
			    .enter().append("rect")
			      .attr("width", x.rangeBand())
			      
			      .attr("y", function(d) { return y(d.y1); })
			      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
			      .style("fill", function(d) { return color(d.name); });

			  var legend = svg.selectAll(".legend")
			      .data(color.domain())
			    .enter().append("g")
			      .attr("class", "legend")
			      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			  legend.append("rect")
			      .attr("x", width - 18)
			      .attr("width", 18)
			      .attr("height", 18)
			      .style("fill", color);

			  legend.append("text")
			      .attr("x", width - 24)
			      .attr("y", 9)
			      .attr("dy", ".35em")
			      .style("text-anchor", "end")
			      .text(function(d) { return d; });



		} else if (this.type === 'grouped') {
			var rowNames = d3.keys(this.json_data[0]).filter(function(key) { return key !== "snapshot_date"; }); 

			  	this.json_data.forEach(function(d) {

					d.amount = rowNames.map(function(name){
						return {name: name, value: +d[name]};
					})

			  	})

				this.json_data.sort(function(a, b) { return new Date(a.snapshot_date) - new Date(b.snapshot_date) ; });
				x.domain(this.json_data.map(function(d) {return d.snapshot_date; }));
				x1.domain(rowNames).rangeRoundBands([0, x.rangeBand()]);
				y.domain([0, d3.max(this.json_data, function(d) { return d3.max(d.amount, function(d) { return d.value; }); })]);

			  svg.append("g")
				  .attr("class", "x axis")
				  .attr("transform", "translate(0," + height + ")")
				  .call(xAxis);

			  svg.append("g")
				  .attr("class", "y axis")
				  .call(yAxis)
				.append("text")
				  .attr("transform", "rotate(-90)")
				  .attr("y", 6)
				  .attr("dy", ".71em")
				  .style("text-anchor", "end")
				  .text("Amount in USD");

			  var state = svg.selectAll(".state")
				  .data(this.json_data)
				.enter().append("g")
				  .attr("class", "g")
				  .attr("transform", function(d) { return "translate(" + x(d.snapshot_date) + ",0)"; })
				  .on("mouseover", function(d){
					var html = "";
				  	var i =  d.amount.length;
					while(i--) {
					  html+= "<span style=\"color:" + color(d.amount[i].name)+"\">" + d.amount[i].name + ": " + moneyFormat(d.amount[i].value) + " </span>"
					};
					tooltip.html("<div class=\"graph-tooltip\">Assessment Date: " + d.snapshot_date + "<br/>" + html + "</div>")
					return tooltip.style("visibility", "visible");})
				  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
				  .on("mouseout", function(){return tooltip.style("visibility", "hidden");})

			  state.selectAll("rect")
				  .data(function(d) { return d.amount; })
				.enter().append("rect")
				  .attr("width", x1.rangeBand())
				  .attr("x", function(d) { return x1(d.name); })
				  .attr("y", function(d) { return y(d.value); })
				  .attr("height", function(d) { return height - y(d.value); })
				  .style("fill", function(d) { return color(d.name); });

			  var legend = svg.selectAll(".legend")
				  .data(rowNames.slice().reverse())
				.enter().append("g")
				  .attr("class", "legend")
				  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


			  legend.append("rect")
				  .attr("x", width - 18)
				  .attr("width", 18)
				  .attr("height", 18)
				  .style("fill", color);

			  legend.append("text")
				  .attr("x", width - 24)
				  .attr("y", 9)
				  .attr("dy", ".35em")
				  .style("text-anchor", "end")
				  .text(function(d) { console.log(d);return d; });
		}

		

		

	}

	function drawAxis() {
		svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

		svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Amount in USD");
	}

}