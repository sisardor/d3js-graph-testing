var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);



var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#a05d56","#8a89a6","#98abc5" ]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      //.text("a simple tooltip")
      .html("a simple tooltip <br>hello");

var moneyFormat = d3.format(".2s");


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