var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 550 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

var topics = ["Relationships", "Arts", "Hunting", "Entertainment", "Investing", "Outdoors", "Wall Street", "Legal", "Sports", "Religion", "International Politics", "NSFW", "Self-Improvement", "Pets", "Opinion", "Medicine", "Automotive", "Dating", "Asia", "Winter Holidays", "Social Media", "Literature", "Eating", "Farming / Gardening", "Business", "Nature", "Food", "Scientific Research", "Photography", "Beverages", "News / Politics", "Diet", "Anatomy", "Energy / Climate Change", "Space", "California", "European Politics", "Judicial", "NBA", "Drugs", "Economics", "Animals", "Conflict / War", "Music", "Brain Science", "Science", "U.S. Politics", "NFL", "Places / Transportation", "Disease", "Fighting", "Movies", "Health Care", "Race", "Women's Health", "Death / Disaster", "Sleep / Spooky", "Fitness", "Conservative Politics", "Digital Entrepreneurship", "Crime", "Startups", "History", "Comedy", "Guns / Police", "Family", "Pro Wrestling", "Medical Treatment", "Colloquial", "U.S. Election 2016", "College Football", "Sex", "Cryptocurrency", "TV", "Fashion / Style", "Radio", "Communication", "Tech", "Money", "Education", "Mobile Tech"]

var colorz = ["#876162", "#9f02fd", "#15c620", "#d60a01", "#cba818", "#1f65d7", "#c90290", "#29bfaa", "#02b7f8", "#47771b", "#fa8e69", "#d894dc", "#c33253", "#b3ac7a", "#9441ce", "#0b7584", "#955f13", "#5c67a0", "#42c26e", "#a1acbe", "#fa9206", "#93b826", "#ed90a3", "#ff74fa", "#1a5afc", "#a54b7d", "#59714f", "#b64708", "#8854a9", "#a55340", "#9ba5f9", "#91b765", "#81663e", "#d2a08f", "#de9e53", "#3cbad1", "#fd83c0", "#8fb3a1", "#077a58", "#6f6e0d", "#616b7c", "#7d40f3", "#ce2330", "#b10ad8", "#bdac51", "#c99ebf", "#bc15b3", "#ae3aa1", "#c32a75", "#6bbc83", "#825f85", "#6abf42", "#84aee5", "#db8cf9", "#ff8d3f", "#6a58ce", "#e19b72", "#3a6f97", "#176cbb", "#ba4138", "#a74f5a", "#726a59", "#177c05", "#b3aa98", "#147b3c", "#fc8a87", "#22c54d", "#fb7fdd", "#64c104", "#92b584", "#b0b129", "#bba0dc", "#3c746a", "#0dc28c", "#e39e1d", "#627133", "#e492bf", "#bd9af9", "#5863bb", "#a85222", "#7cb4be"]

/*
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */

// setup x
var xValue = function(d) { return d.x;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d.y;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
    //color = d3.scale.category10();
    color = d3.scale.ordinal()
    .domain(topics)
    .range(colorz);

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// svg.append("text")
//         .attr("x", (width / 2))
//         .attr("y", 10 - (margin.top / 2))
//         .attr("text-anchor", "middle")
//         .style("font-size", "20px")
//         .text("Episodes Clustered By Topic");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv('byEpisode/topics.csv', function(error, data) {

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.x = +d.x;
    d.y = +d.y;
    // console.log(d);
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  /*svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("X");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("y");*/

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("opacity", .7)
      .style("fill", function(d) { return color(d.topTopic);})
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("Show: " + d["showTitle"] + "<br/>" + "Episode: " + d["episodeTitle"] + "<br/>" +"Topic: " + d["topTopic"])
               .style("left", 0 + "px")
               .style("top", height+50 + "px")
               .style("width", "auto");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  // draw legend
  /*var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})*/
});
