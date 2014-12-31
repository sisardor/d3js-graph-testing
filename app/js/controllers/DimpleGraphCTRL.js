'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
function DimpleGraphCTRL() {
 	console.log('DimpleGraphCTRL');













	// // This is the simple vertical grouped stacked 100% bar example
 //    var svg = dimple.newSvg("#chart1", 590, 400);
 //    d3.tsv("/example_data.tsv", function (data) {
 //    	console.log(data)
 //      var myChart = new dimple.chart(svg, data);
 //      myChart.setBounds(65, 45, 505, 315)
 //      var x = myChart.addCategoryAxis("x", ["Price Tier", "Channel"]);
 //      var y = myChart.addPctAxis("y", "Unit Sales");
 //      var s = myChart.addSeries("Owner", dimple.plot.bar);
 //      // Using the afterDraw callback means this code still works with animated
 //      // draws (e.g. myChart.draw(1000)) or storyboards (though an onTick callback should
 //      // also be used to clear the text from the previous frame)
 //      s.afterDraw = function (shape, data) {
 //        // Get the shape as a d3 selection
 //        var s = d3.select(shape),
 //          rect = {
 //            x: parseFloat(s.attr("x")),
 //            y: parseFloat(s.attr("y")),
 //            width: parseFloat(s.attr("width")),
 //            height: parseFloat(s.attr("height"))
 //          };
 //        // Only label bars where the text can fit
 //        if (rect.height >= 8) {
 //          // Add a text label for the value
 //          svg.append("text")
 //            // Position in the centre of the shape (vertical position is
 //            // manually set due to cross-browser problems with baseline)
 //            .attr("x", rect.x + rect.width / 2)
 //            .attr("y", rect.y + rect.height / 2 + 3.5)
 //            // Centre align
 //            .style("text-anchor", "middle")
 //            .style("font-size", "10px")
 //            .style("font-family", "sans-serif")
 //            // Make it a little transparent to tone down the black
 //            .style("opacity", 0.6)
 //            // Format the number
 //            .text(d3.format(",.1f")(data.yValue / 1000) + "k");
 //        }
 //      };
 //      myChart.addLegend(200, 10, 380, 20, "right");
 //      myChart.draw();
 //    });



	// var svg = dimple.newSvg("#chart1", 590, 400);
 //    d3.tsv("/example_data.tsv", function (data) {
 //      var myChart = new dimple.chart(svg, data);
 //      myChart.setBounds(60, 30, 510, 330)
 //      myChart.addCategoryAxis("x", ["Price Tier", "Channel"]);
 //      myChart.addMeasureAxis("y", "Unit Sales");
 //      myChart.addSeries("Channel", dimple.plot.bar);
 //      myChart.addLegend(65, 10, 510, 20, "right");
 //      myChart.draw();
 //    });


	var svg = dimple.newSvg("#chart1", 590, 400);
    d3.tsv("/example_data.tsv", function (data) {
    	console.log(data)
      var myChart = new dimple.chart(svg, data);
      myChart.setBounds(80, 30, 480, 330)
      myChart.addMeasureAxis("x", "Unit Sales");
      myChart.addCategoryAxis("y", ["Price Tier"]);
      myChart.addSeries("Owner", dimple.plot.bar);
      myChart.addLegend(200, 10, 380, 20, "right");
      myChart.draw();
    });












}

controllersModule.controller('DimpleGraphCTRL', DimpleGraphCTRL);


// SELECT 
//   measurement_sensitivity.measurement_nbr, 
//   measurement_sensitivity.customer_id, 
//   measurement_sensitivity.rwa_treatment_code, 
//   measurement_sensitivity.scenario, 
//   measurement_sensitivity.report_asset_class_code, 
//   measurement_sensitivity.risk_weighted_lcy_amt, 
//   measurement_sensitivity.exposure_type_code, 
//   measurement_sensitivity.k_capital_requirement_factor, 
//   measurement_sensitivity.snapshot_date, 
//   measurement_sensitivity.exposure_at_default_lcy_amt, 
//   measurement_sensitivity.expected_loss_lcy_amt, 
//   measurement_sensitivity.credit_score, 
//   measurement_sensitivity.correlation_factor
// FROM 
//   admin.measurement_sensitivity
// WHERE 
//   measurement_sensitivity.scenario = 'RC';
