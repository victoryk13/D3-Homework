// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3
  .select("body")
    .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      // Append a group area, then set its margins
      .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// Configure a parseTime function which will return a new Date object from a string

// Load data from data.csv
d3.csv("assets/js/data/data.csv", function(error, data) {

  // Throw an error if one occurs
  if (error) throw error;

  // Print the data
  console.log(data);

  // Cast the poverty and healthcare values to numbers
  data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Configure a linear scale with a range between 0 and the chartWidth
  var xLinearScale = d3.scaleLinear().range([0, chartWidth]);

  // Configure a linear scale with a range between the chartHeight and 0
  var yLinearScale = d3.scaleLinear().range([chartHeight, 0]);

  // Set the domain for the xLinearScale function
  // d3.extent returns the an array containing the min and max values for the property specified
  xLinearScale.domain(d3.extent(data, function(data) {
    return data.poverty;
  }));

  // Set the domain for the xLinearScale function
  yLinearScale.domain([0, d3.max(data, function(data) {
    return data.healthcare;
  })]);

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  /* Define the data for the circles */
  var elem = svg.selectAll("scatter-dots")
    .data(data)

  /*Create and place the "blocks" containing the circle and the text */
  var elemEnter = elem.enter()
    .append("g")
    .attr("transform", function(data){return "translate("+xLinearScale(data.poverty)+","+yLinearScale(data.healthcare)+")"})

  /*Create the circle for each block */
  var circle = elemEnter.append("circle")
    .attr("r", 20)
    .attr("stroke","white")
    .attr("fill", "lightblue")

  /* Create the text for each block */
  elemEnter.append("text")
    .attr("dx", function(data){return -10})
    .text(function(data){return data.abbr})

  //svg.selectAll("scatter-dots")
      //.data(data)
      //.enter().append("svg:circle")
          //.attr("cx", function (data) { return xLinearScale(data.poverty); } )
          //.attr("cy", function (data) { return yLinearScale(data.healthcare); } )
          //.attr("r", 8)
          //.attr("stroke", "white")
          //.attr("fill", "lightblue")
          //;

  // Append an SVG group element to the SVG area, create the left axis inside of it
  svg.append("g")
    .attr("class", "axis")
    .call(leftAxis);

  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (chartHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Lacks Healthcare (%)");

  // Append an SVG group element to the SVG area, create the bottom axis inside of it
  // Translate the bottom axis to the bottom of the page
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + chartHeight + ")")
    .call(bottomAxis);

  // text label for the x axis
  svg.append("text")             
      .attr("transform",
            "translate(" + (chartWidth/2) + " ," + 
                           (chartHeight + margin.top - 20) + ")")
      .style("text-anchor", "middle")
      .text("In Poverty (%)");
});