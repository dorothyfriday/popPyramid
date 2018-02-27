var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var svgHeight = 400;
var svgWidth = 450;

var margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
    middle: svgWidth*0.1
};

console.log(margin.middle)

var heightNum = margin.top + margin.bottom + svgHeight;
var widthNum = margin.right + margin.left + svgWidth;

var height = heightNum + "px"
var width = widthNum + "px"

var barPadding = 7

//the width of each side of the chart
var regionWidth = (svgWidth/2)-(margin.middle/2);

// these are the x-coordinates of the y-axes
var pointA = regionWidth
var pointB = regionWidth + margin.middle;

console.log(pointA)
console.log(pointB)

var exampleData = [
    {group: '0-4', male: 8353, female: 7707},
    {group: '5-9', male: 9369, female: 8929},
    {group: '10-14', male: 9295, female: 8860},
    {group: '15-19', male: 12493, female: 12036},
    {group: '20-24', male: 17203, female: 15205},
    {group: '25-29', male: 16129, female: 9382},
    {group: '30-34', male: 9992, female: 9653},
    {group: '35-39', male: 9901, female: 10063},
    {group: '40-44', male: 10599, female: 10206},
    {group: '45-49', male: 10304, female: 10581},
    {group: '50-54', male: 10895, female: 11257},
    {group: '55-59', male: 10259, female: 10758},
    {group: '60-64', male: 8442, female: 8502},
    {group: '65-69', male: 5776, female: 6228},
    {group: '70-74', male: 3716, female: 4076},
    {group: '75-79', male: 2666, female: 2874},
    {group: '80-84', male: 1476, female: 2424},
    {group: '85+', male: 1432, female: 3125}
];

//calculate the total population size and create a function for returning percentage
var totalPopulation = d3.sum(exampleData, function(d) { return d.male + d.female; }),
    percentage = function(d) { return d / totalPopulation; };

console.log(totalPopulation)
console.log(percentage)

//create svg
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    //add a group for the space within the margins
    .append("g")
    .attr("transform",
        "translate(0,0)");

var maxValue = Math.max(
    d3.max(exampleData, function(d) { return percentage(d.male); }),
    d3.max(exampleData, function(d) { return percentage(d.female); })
);

console.log(maxValue)
//set up the scales

var xScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, regionWidth]);

console.log(xScale)

var xScaleLeft = d3.scaleLinear()
    .domain([0, maxValue])
    .range([regionWidth, 0]);

var xScaleRight = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, regionWidth]);

var yScale = d3.scaleBand()
    .domain(exampleData.map(function(d){return d.group; }))
    .range([svgHeight-margin.bottom, margin.top], 0.1);

console.log(yScale)

//SET UP AXES

svg.append('g')
   .attr("class", 'leftline')
   .attr("transform", "translate("+ pointA + ", 0)")
    .call(d3.axisRight(yScale).tickSizeOuter(0));

//to center text between axes--- manually adjust this....
var middle = (svgWidth/2)-(8)

svg.append('g')
    .attr("class", 'text-labels')
    .attr("transform", "translate(" + middle + ", 0)")
    .call(d3.axisRight(yScale).tickSizeOuter(0));

svg.append('g')
    .attr("class", 'rightline')
    .attr("transform", "translate(" + pointB + ", 0)")
    .call(d3.axisLeft(yScale).tickSizeOuter(0));

svg.append("g")
    .attr("class", "axisleftside")
    .call(d3.axisBottom(xScaleLeft).ticks(3).tickFormat(d3.format(".0%")))
    .attr("transform","translate(" + 0 +"," + svgHeight + ")");

svg.append("g")
    .attr("class", "axisrightside")
    .call(d3.axisBottom(xScaleRight).ticks(3).tickFormat(d3.format(".0%")))
    .attr("transform","translate(" + pointB + "," + svgHeight + ")");

// In axisleftside, scale(-1,1) is used to reverse the left side so the bars grow left instead of right

svg.selectAll("rect.men")
      .data(exampleData)
      .enter().append("rect")
                .attr("class","men")
                .attr("height", heightNum/exampleData.length - barPadding)
                .attr("width", function(d) { return xScale(percentage(d.male)); })
                .attr("fill","#05a4e1")
                .attr("opacity","0.5")
                .attr("x", pointB)
                .attr("y",function(d) { return yScale(d.group)+5; })
                .on("mouseover",function(d){
                        div.transition()
                            .duration(200)
                            .style("opacity",0.95)
                        div.html(d3.format(",.4r")(d.male) + " total males in " + d.group + " age group")
                             .style("left", (d3.select(this).attr("x"))+ "px")
                             .style("top", (d3.select(this).attr("y")) + "px");
                            })
                     .on("mouseout", function() {
                             div.transition()
                                .duration(200)
                                .style("opacity",0);
                                 });

svg.selectAll("rect.women")
    .data(exampleData)
    .enter().append("rect")
      .attr("class","women")
      .attr("height", heightNum/exampleData.length - barPadding)
     .attr("width", function(d) { return xScale(percentage(d.female)); })
        .attr("fill","#ADC70D")
        .attr("opacity","0.7")
        .attr("x", function(d){ return (pointA)-xScale(percentage(d.female)); })
        .attr("y", function(d) { return yScale(d.group) + 5; })
.on("mouseover",function(d){
    div.transition()
        .duration(200)
        .style("opacity",0.95)
    div.html(d3.format(",.4r")(d.female) + " total females in " + d.group + " age group")
        .style("left", (d3.select(this).attr("x")) + "px")
        .style("top", (d3.select(this).attr("y")) + "px");
})
    .on("mouseout", function() {
        div.transition()
            .duration(200)
            .style("opacity",0);
    });


svg.append("text").selectAll("tspan.female")
    .data(exampleData)
    .enter().append("tspan")
    .attr("class","female")
    .attr("x", function(d){
        if ((pointA)-xScale(percentage(d.female)) > 40) {return (pointA)-(4)-xScale(percentage(d.female))}
        else {return (pointA)+(40)-xScale(percentage(d.female))};})
    .attr("y",function(d) { return yScale(d.group) + heightNum/exampleData.length - barPadding; })
    .attr("fill",function(d){
        if ((pointA)-xScale(percentage(d.female)) > 40) {return "grey"}
        else {return "white"};})
    .attr("stroke-width","2")
    .attr("text-anchor","end")
    .attr("font-size","12")
    .attr("font-family","Arial")
    .attr("font-weight","bold")
    .text(function(d){ return d3.format(",.4r")(d.female); });

svg.append("text").selectAll("tspan.male")
    .data(exampleData)
    .enter().append("tspan")
    .attr("class","male")
    .attr("x", function(d) {
        if (((pointB) + xScale(percentage(d.male))) < (svgWidth-40)) {return (pointB) + (4) + xScale(percentage(d.male))}
        else {return (pointB)-(40) + xScale(percentage(d.male))};})
    .attr("y",function(d) { return yScale(d.group)+ heightNum/exampleData.length - barPadding; })
    .attr("fill",function(d) {
        if (((pointB) + xScale(percentage(d.male))) < (svgWidth-40)) {return "grey"}
        else {return "white"};})
    .attr("stroke-width","2")
    .attr("text-anchor","start")
    .attr("font-size","12")
    .attr("font-family","Arial")
    .attr("font-weight","bold")
    .text(function(d){ return d3.format(",.4r")(d.male); });

