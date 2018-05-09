(function(){
var margin = {top: 20, right: 20, bottom: 20, left: 100},
padding = {top: 60, right: 60, bottom: 60, left: 60},
outerWidth = 1100,
outerHeight = 500,
innerWidth = outerWidth - margin.left - margin.right,
innerHeight = outerHeight - margin.top - margin.bottom,
width = innerWidth - padding.left - padding.right,
height = innerHeight - padding.top - padding.bottom;

var spending = document.querySelector('input[value="gov"]');
var gdp = document.querySelector('input[value="gdp"]');
var usd = document.querySelector('input[value="usd"]');
var boxes = document.getElementsByName('spending');


var vis1 = document.getElementById('vis1');
var vis2 = document.getElementById('vis2');
var vis3 = document.getElementById('vis3');
var box = document.getElementsByClassName('box');



var svg = d3.select("#vis1")
    .append("svg")
      .attr('width', outerWidth)
      .attr('height', outerHeight)
    .append('g')
      .attr('transform', 'translate(' + [margin.left, margin.bottom] +')');

var svg2 = d3.select("#vis2")
    .append("svg")
      .attr('width', outerWidth)
      .attr('height', outerHeight)
    .append('g')
      .attr('transform', 'translate(' + [margin.left, margin.bottom] +')');

var svg3 = d3.select("#vis3")
    .append("svg")
      .attr('width', outerWidth)
      .attr('height', outerHeight)
    .append('g')
      .attr('transform', 'translate(' + [margin.left, margin.bottom] +')');


var rowConverter = function(d) {
  return {
    Country: d.Country,
    Year: parseFloat(d.Year),
    govSpending: parseFloat(d["Percent of Gov Spending"]),
    gdp: parseFloat(d["Percent of GDP"]),
    totalUsd: parseFloat(d["Total USD"])
  };
}


function getYear(data, date) {
  var year =[];
  for (i=0; i <data.length; i++) {
    if (isNaN(data[i].govSpending)) {
      continue;
    } if (isNaN(data[i].gdp)){
      continue;
    } if (isNaN(data[i].totalUsd)) {
      continue;
    } if(data[i].Country == "United States") {
      continue;
    } if (data[i].Country == "Russia") {
      continue;
    } if (data[i].Country == "China") {
      continue;
    } if (data[i].Year == date) {
      year.push(data[i]);
    }
  }

  return year;
}


var xScale = d3.scaleBand()
.range([0, width])
.paddingInner(.07)
.paddingOuter(.05);



//function that runs chart
function percentGov(year) {

var trans = d3.transition()
    .duration(1000)

var xScale = d3.scaleBand()
  .range([0, width])
  .paddingInner(.07)
  .paddingOuter(.05);

var colorScale = d3.scaleLinear()
  .domain(d3.extent(year, function(d) {return d.govSpending}))
  .range(["#efedf5", "#756bb1"]);

var yScale = d3.scaleLinear()
  .domain([0, d3.max(year, function(d){ return d.govSpending})])
  .range([height, 0]);

var yAxis = d3.axisLeft()
  .scale(yScale);


xScale.domain(d3.range(year.length));

var listCountry = year.map(function(d){return d.Country});
//countries = d3.set(countries).values();
//console.log("countries", countries);
countries=[]
for (i=0;i<listCountry.length;i++) {
  if (listCountry[i] == "United Arab Emirates") {
    var UAE = listCountry[i]
    UAE = "UAE"
    // console.log(UAE)
    countries.push(UAE)
  } else if (listCountry[i] == "United States") {
    listCountry[i] = "U.S."
    countries.push(listCountry[i]);
  } else if (listCountry[i] == "Saudi Arabia") {
    listCountry[i] = "Saudi A."
    countries.push(listCountry[i]);
  } else {
    countries.push(listCountry[i]);
  }
}



var x = d3.scaleBand()
  .domain(countries)
  .range([0, width]);

var xAxis = d3.axisBottom()
  .scale(x);

var bars = svg.selectAll(".bar")
   .data(year)

 bars
     .exit()
     .remove();

var new_bars = bars
   .enter()
   .append('rect')
   .attr('class','bar')
   .attr('y', height)
   .attr('x', width/2)
   .attr("fill", function(d){
     return colorScale(d.govSpending);
   });


new_bars.merge(bars)
   .transition(trans)
   .attr("height", function(d, i){ return height - yScale(d.govSpending); })
   .attr("y", function(d, i){ return yScale(d.govSpending); })
   .attr('width', xScale.bandwidth())
   .attr("x", function(d, i){ return xScale(i); })
   .attr("fill", function(d){
     return colorScale(d.govSpending);
   });


var labels = svg.selectAll('.labels')
  .data(year)

labels
  .exit()
    .attr('y', height)
    .attr('x', width/2)
  .remove()

var newLabels = labels
  .enter()
  .append('text')
  .attr('y', height)
  .attr('x', width/2)
  .attr('class', 'labels')

newLabels.merge(labels)
.transition(trans)
  .attr("x", function(d, i) {return xScale(i) + xScale.bandwidth()/2})
  .attr("y", function(d){return yScale(d.govSpending)+1})
  .attr("dy", ".75em")
  .attr("text-anchor", "middle")
  .attr("font-family", "sans-serif")
  .attr("font-size", "10px")
  .text(function(d) {return (d.govSpending.toFixed(3)*100).toFixed(1) +"%"});


svg.append('g')
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x axis")

svg.append('g')
  .attr("transform", "translate(" + -5+ ",0)")
  .attr('class', 'y axis');

svg.select('.y.axis')
  .call(yAxis);

svg.select('.x.axis')
  .call(xAxis)
  .selectAll("text")

svg.append('text')
  .attr('transform',
        "translate(" + (width/2) + "," + (height + 50) + ")")
  .attr('text-anchor', 'middle')
  .text('Percent of Government Spending Invested in Military')

}


function percentGdp(year) {

  var trans = d3.transition()
      .duration(1000)

  var xScale = d3.scaleBand()
    .range([0, width])
    .paddingInner(.07)
    .paddingOuter(.05);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(year, function(d){ return d.gdp})])
    .range([height, 0]);

  var colorScale = d3.scaleLinear()
    .domain(d3.extent(year, function(d) {return d.gdp}))
    .range(["#efedf5", "#756bb1"]);

  var yAxis = d3.axisLeft()
    .scale(yScale);


  xScale.domain(d3.range(year.length));

  var listCountry = year.map(function(d){return d.Country});
  //countries = d3.set(countries).values();
  //console.log("countries", countries);
  countries=[]
  for (i=0;i<listCountry.length;i++) {
    if (listCountry[i] == "United Arab Emirates") {
      var UAE = listCountry[i]
      UAE = "UAE"
      // console.log(UAE)
      countries.push(UAE)
    } else if (listCountry[i] == "United States") {
      listCountry[i] = "U.S."
      countries.push(listCountry[i]);
    } else if (listCountry[i] == "Saudi Arabia") {
      listCountry[i] = "Saudi A."
      countries.push(listCountry[i]);
    } else {
      countries.push(listCountry[i]);
    }
  }



  var x = d3.scaleBand()
    .domain(countries)
    .range([0, width]);

  var xAxis = d3.axisBottom()
    .scale(x);

  var bars = svg2.selectAll(".bar2")
     .data(year)

   bars
       .exit()
       .remove();

 var new_bars = bars
     .enter()
     .append('rect')
     .attr('class','bar2')
     .attr("fill", function(d){return colorScale(d.gdp)});

 new_bars.merge(bars)
     .transition(trans)
     .attr("height", function(d, i){ return height - yScale(d.gdp); })
     .attr("y", function(d, i){ return yScale(d.gdp); })
     .attr('width', xScale.bandwidth())
     .attr("x", function(d, i){ return xScale(i); })
     .attr("fill", function(d){return colorScale(d.gdp)});


  var labels = svg2.selectAll('.labels2')
    .data(year)

  labels
    .exit()
      .attr('y', height)
      .attr('x', width/2)
    .remove()

  var newLabels = labels
    .enter()
    .append('text')
    .attr('class', 'labels2')

  newLabels.merge(labels)
  .transition(trans)
    .attr("x", function(d, i) {return xScale(i) + xScale.bandwidth()/2})
    .attr("y", function(d){return yScale(d.gdp)+1})
    .attr("dy", ".75em")
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .text(function(d) {return (d.gdp.toFixed(3)*100).toFixed(1) +"%"});


  svg2.append('g')
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x axis2")

  svg2.append('g')
    .attr("transform", "translate(" + -5+ ",0)")
    .attr('class', 'y axis2');

  svg2.select('.y.axis2')
    .call(yAxis);

  svg2.select('.x.axis2')
    .call(xAxis)
    .selectAll("text")

  svg2.append('text')
    .attr('transform',
          "translate(" + (width/2) + "," + (height + 50) + ")")
    .attr('text-anchor', 'middle')
    .text('Percent of GDP Invested in Military')

  }


  function totalUsd(year) {

    var trans = d3.transition()
        .duration(1000)

    var xScale = d3.scaleBand()
      .range([0, width])
      .paddingInner(.07)
      .paddingOuter(.05);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(year, function(d){ return d.totalUsd})])
      .range([height, 0]);

    var colorScale = d3.scaleLinear()
      .domain(d3.extent(year, function(d) {return d.totalUsd}))
      .range(["#efedf5", "#756bb1"]);

    var yAxis = d3.axisLeft()
      .scale(yScale);


    xScale.domain(d3.range(year.length));

    var listCountry = year.map(function(d){return d.Country});
    //countries = d3.set(countries).values();
    //console.log("countries", countries);
    countries=[]
    for (i=0;i<listCountry.length;i++) {
      if (listCountry[i] == "United Arab Emirates") {
        var UAE = listCountry[i]
        UAE = "UAE"
        // console.log(UAE)
        countries.push(UAE)
      } else if (listCountry[i] == "United States") {
        listCountry[i] = "U.S."
        countries.push(listCountry[i]);
      } else if (listCountry[i] == "Saudi Arabia") {
        listCountry[i] = "Saudi A."
        countries.push(listCountry[i]);
      } else {
        countries.push(listCountry[i]);
      }
    }



    var x = d3.scaleBand()
      .domain(countries)
      .range([0, width]);

    var xAxis = d3.axisBottom()
      .scale(x);

    var bars = svg3.selectAll(".bar3")
       .data(year)

     bars
         .exit()
         .transition(trans)
         .remove();

   var new_bars = bars
       .enter()
       .append('rect')
       .attr('class','bar3')
       .attr("fill", function(d){return colorScale(d.totalUsd)});

   new_bars.merge(bars)
       .transition(trans)
       .attr("height", function(d, i){ return height - yScale(d.totalUsd); })
       .attr("y", function(d, i){ return yScale(d.totalUsd); })
       .attr('width', xScale.bandwidth())
       .attr("x", function(d, i){ return xScale(i); })
       .attr("fill", function(d){return colorScale(d.totalUsd)});


    svg3.append('g')
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis3")

    svg3.append('g')
      .attr("transform", "translate(" + -5+ ",0)")
      .attr('class', 'y axis3');

    svg3.select('.y.axis3')
      .call(yAxis);

    svg3.select('.x.axis3')
      .call(xAxis)
      .selectAll("text")

    svg3.append('text')
      .attr('transform',
            "translate(" + (width/2) + "," + (height + 50) + ")")
      .attr('text-anchor', 'middle')
      .text('Total USD Spend on Military')

    }



d3.csv("Spending_Bar_Chart/Bar Chart.csv", rowConverter, function(data){

  var data = data;
  // console.log(data);

  var year = []
  for (i=0;i<data.length;i++) {
    if (isNaN(data[i].govSpending)) {
      continue;
    } else if (isNaN(data[i].gdp)){
      continue;
    } else if (isNaN(data[i].totalUsd)) {
      continue;
    } else if(data[i].Country == "United States") {
      continue;
    } else if (data[i].Country == "Russia") {
      continue;
    } else if (data[i].Country == "China") {
      continue;
    } else if (data[i].Year == 2002){
      year.push(data[i])
    }
  }



  // console.log(year);
  percentGov(year);
  percentGdp(year);
  totalUsd(year);



  var slider = document.getElementById("rating1");
  slider.addEventListener("change", function() {
    var sliderValue = document.getElementById('rating1').value;
    document.getElementById('sliderVal1').innerHTML = sliderValue;
    var years = getYear(data, sliderValue);

    //add in some if statements depending on what is checked and what isn't

    // console.log('year', years);
    percentGov(years);
    percentGdp(years);
    totalUsd(years);
  })

  vis2.style.display = 'none';
  vis3.style.display = 'none';


  spending.addEventListener("change", function(){
    if (spending.checked == true){
      checkOne(spending);
      vis1.style.display = 'block';
      vis2.style.display = 'none';
      vis3.style.display = 'none';
    } else if (spending.checked == false){
      vis1.style.display = 'none';
    }
  })

  gdp.addEventListener("change", function(){
    if (gdp.checked == true){
      checkOne(gdp);
      vis2.style.display = 'block';
      vis1.style.display = 'none';
      vis3.style.display = 'none';
    } else if (gdp.checked == false){
      vis2.style.display = 'none';
    }
  })


  usd.addEventListener("change", function(){
    if (usd.checked == true){
      checkOne(usd);
      vis3.style.display = 'block';
      vis1.style.display = 'none';
      vis2.style.display = 'none';
    } else if (usd.checked == false) {
      vis3.style.display = 'none';
    }
  })

  function checkOne(stayChecked){
    for(var i=0; i<box.length; i++){
      if(box[i].checked == true && box[i].value != stayChecked.value) {
        box[i].checked = false;
      }
    }
  }



  // console.log('boxes', box);


  })

})();
