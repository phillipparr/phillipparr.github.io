(function(){
  var width = 960;
  var height = 700;

  var margin = {top:20, left:100, right:100, bottom:60};

  var svg = d3.select("#vis")
      .append("svg")
        .attr('width', width)
        .attr('height', height)
      .append('g')
        .attr('transform', 'translate(' + margin.left + "," + margin.top+')');


  height= height-margin.top - margin.bottom;
  width = width-margin.left - margin.right;


  svg.append('g')
    .attr('transform', 'translate(0,'+height+')')
    .attr('class', 'x axis');

  svg.append('g')
    .attr('class', 'y axis');

  svg.append("text")
    .attr("transform",
          "translate(" + (-70) + " ," +
              (height/2) + ")rotate(-90)")
    .attr("text-anchor", "middle")
    .text("USD per Capita Invested in the Military ");


  svg.append('text')
    .attr('transform',
          "translate(" + (width/2) + "," + (height+margin.bottom-20) + ")")
    .attr('text-anchor', 'middle')
    .text('Gross Domestic Product (GDP) per capita')


  var rowConverter = function(d) {
    return {
      Country: d.Country,
      Year: parseFloat(d.Year),
      Expenditure_per_cap: parseFloat(d.Expenditure_per_cap),
      "GDP per capita": parseFloat(d["GDP per capita"])
    };
  }








  function getYear(data, date) {
    var year =[];
    for (i=0; i <data.length; i++) {
      if (isNaN(data[i].Expenditure_per_cap)) {
        continue
      } else if (isNaN(data[i]["GDP per capita"])){
        continue
      } else if (data[i].Year == date) {
        year.push(data[i]);
      }
    }

    return year;
  }



  function runIt(year) {

    var trans = d3.transition()
        .duration(1000)


    var dots = svg.selectAll(".dot")
         .data(year);


     var xScale = d3.scaleLinear()
          .domain([0, d3.max(year, function(d){ return d["GDP per capita"]})])
          .range([0, width]);

     var yScale = d3.scaleLinear()
          .domain([0, d3.max(year, function(d){ return d.Expenditure_per_cap})])
          .range([height, 0]);


    var rscale =d3.scaleLinear()
      .domain([0, d3.max(year, function(d){
        return d.Expenditure_per_cap;
      })])
      .range([2, 8]);

     var xAxis = d3.axisBottom(xScale);
     var yAxis = d3.axisLeft(yScale);



     dots
         .exit()
           .transition(trans)
             .attr('cy', height)
             .attr('cx', 0)
         .remove();

      var new_dots = dots
          .enter()
          .append('circle')
          .attr('r', 3)
  //sets the origin points to these coordinates, when they come out
  //they begin at the bottom left of axis
          .attr('cy', height)
          .attr('cx', 0)
          .attr('fill', function(d){
            if (d.Country == "Egypt") {
              return "green";
            } else if (d.Country == "Yemen"){
              return "green";
            } else if (d.Country== "Saudi Arabia"){
              return "green";
            } else if (d.Country== "Qatar") {
              return "green";
            } else if (d.Country == "United Arab Emirates"){
              return "green";
            } else if (d.Country =="Turkey"){
              return "green";
            } else if (d.Country == "Jordan"){
              return "green";
            } else if (d.Country =="Kuwait"){
              return "green";
            }
            else if (d.Country == "Iran"||d.Country =="Syria" || d.Country=="Iraq"|| d.Country =="Bahrain"){
              return "red";
            } else if (d.Country == "Israel"){
              return "blue";
            } else {
              return "black";
            }
          })
          .attr('stroke', 'black')
          .attr('class','dot')



      new_dots.merge(dots)
        .transition(trans)
        .attr("cy", function(d, i){ return yScale(d.Expenditure_per_cap); })
        .attr("cx", function(d, i){return xScale(d["GDP per capita"]);})
        .attr('r', function(d){ return rscale(d.Expenditure_per_cap);})
        .attr('fill', function(d){
          if (d.Country == "Egypt") {
            return "green";
          } else if (d.Country == "Yemen"){
            return "green";
          } else if (d.Country== "Saudi Arabia"){
            return "green";
          } else if (d.Country== "Qatar") {
            return "green";
          } else if (d.Country == "United Arab Emirates"){
            return "green";
          } else if (d.Country =="Turkey"){
            return "green";
          } else if (d.Country == "Jordan"){
            return "green";
          } else if (d.Country =="Kuwait"){
            return "green";
          }
          else if (d.Country == "Iran"||d.Country =="Syria" || d.Country=="Iraq"|| d.Country =="Bahrain"){
            return "red";
          } else if (d.Country == "Israel"){
            return "blue";
          } else {
            return "black";
          }
        });




      var labels = svg.selectAll('.labels')
        .data(year)

      labels
        .exit()
        .transition(trans)
          .attr('y', height)
          .attr('x', 0)
        .remove()

      var newLabels = labels
        .enter()
        .append('text')
        .attr('class', 'labels')

      newLabels.merge(labels)
        .transition(trans)
        .attr('x', function(d){
          if (d.Year == 1988 && d.Country =="Lebanon") {
            return xScale(d["GDP per capita"]) -12;
          } else if (d.Year == 1990 && d.Country =="Egypt"){
            return xScale(d["GDP per capita"]) -17;
          } else if (d.Year == 1991 && d.Country =="Yemen") {
            return xScale(d["GDP per capita"]) -24;
          } else if (d.Year == 1991 && d.Country == "Egypt") {
            return xScale(d["GDP per capita"]) -3;
          } else if (d.Year == 1993 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -20;
          } else if (d.Year == 1993 && d.Country == "Syria") {
            return xScale(d["GDP per capita"]) -20;
          } else if (d.Year == 1993 && d.Country == "Egypt") {
            return xScale(d["GDP per capita"]) -20;
          } else if (d.Year == 1995 && d.Country == "Syria") {
            return (xScale(d["GDP per capita"]) -30);
          } else if (d.Year == 1995 && d.Country == "Egypt") {
            return xScale(d["GDP per capita"]) -29;
          } else if (d.Year == 1995 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) + 14;
          } else if (d.Year == 1996 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -15;
          } else if (d.Year == 1996 && d.Country == "Syria") {
            return xScale(d["GDP per capita"]) -15;
          } else if (d.Year == 1996 && d.Country == "Egypt") {
            return xScale(d["GDP per capita"]) + 6;
          } else if (d.Year == 1997 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -15;
          } else if (d.Year == 1997 && d.Country == "Syria") {
            return xScale(d["GDP per capita"]) -15;
          } else if (d.Year == 1997 && d.Country == "Egypt") {
            return xScale(d["GDP per capita"]) + 6;
          } else if (d.Year == 1998 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -15;
          } else if (d.Year == 1998 && d.Country == "Syria") {
            return xScale(d["GDP per capita"]) -15;
          } else if (d.Year == 1999 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -11;
          } else if (d.Year == 1999 && d.Country == "Syria") {
            return xScale(d["GDP per capita"]) -15;
          } else if (d.Year == 1999 && d.Country == "Jordan") {
            return xScale(d["GDP per capita"]) -24;
          } else if (d.Year == 2000 && d.Country == "Iran") {
            return xScale(d["GDP per capita"]) -22;
          } else if (d.Year == 2000 && d.Country == "Syria") {
            return xScale(d["GDP per capita"]) -20;
          } else if (d.Year == 2000 && d.Country == "Oman") {
            return xScale(d["GDP per capita"]) -26;
          } else if (d.Year == 2002 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -22;
          } else if (d.Year == 2002 && d.Country == "Egypt") {
            return xScale(d["GDP per capita"]) -10;
          } else if (d.Year == 2003 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -15;
          } else if (d.Year == 2004 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -30;
          } else if (d.Year == 2004 && d.Country == "Egypt") {
            return xScale(d["GDP per capita"]) -5;
          } else if (d.Year == 2004 && d.Country == "Syria") {
            return xScale(d["GDP per capita"]) -15;
          } else if (d.Year == 2005 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -30;
          } else if (d.Year == 2005 && d.Country == "Egypt") {
            return xScale(d["GDP per capita"]) -5;
          } else if (d.Year == 2005 && d.Country == "Syria") {
            return xScale(d["GDP per capita"]) -15;
          } else if (d.Year == 2006 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -30;
          } else if (d.Year == 2007 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -30;
          } else if (d.Year == 2011 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -15;
          } else if (d.Year == 2012 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -15;
          } else if (d.Year == 2013 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -15;
          } else if (d.Year == 2014 && d.Country == "Yemen") {
            return xScale(d["GDP per capita"]) -15;
          } else if (d.Year == 2015 && d.Country == "Jordan") {
            return xScale(d["GDP per capita"]) -20;
          }
          else {
          return xScale(d["GDP per capita"])+5;
        }
        })
        .attr('y', function(d){
          if (d.Year == 2016 && d.Country=='Iran') {
            return yScale(d.Expenditure_per_cap) +4;
          } else if (d.Year == 1990 && d.Country =="Lebanon") {
            return yScale(d.Expenditure_per_cap) +9;
          } else if (d.Year == 1990 && d.Country =="Jordan") {
            return yScale(d.Expenditure_per_cap) +4
          } else if (d.Year == 1991 && d.Country == "Lebanon") {
            return yScale(d.Expenditure_per_cap) +5;
          } else if (d.Year == 1991 && d.Country == "Egypt") {
            return yScale(d.Expenditure_per_cap)-2;
          } else if (d.Year == 1995 && d.Country == "Iran") {
            return yScale(d.Expenditure_per_cap) + 4;
          } else if (d.Year == 1995 && d.Country=="Egypt") {
            return yScale(d.Expenditure_per_cap) +5;
          } else if (d.Year == 1995 && d.Country=="Yemen") {
            return yScale(d.Expenditure_per_cap) -9;
          } else if (d.Year == 1995 && d.Country == "Syria") {
            return yScale(d.Expenditure_per_cap) -2;
          } else if (d.Year == 1996 && d.Country == "Egypt") {
            return yScale(d.Expenditure_per_cap) +5;
          } else if (d.Year == 1997 && d.Country == "Egypt") {
            return yScale(d.Expenditure_per_cap) +5;
          } else if (d.Year == 2000 && d.Country == "Yemen") {
            return yScale(d.Expenditure_per_cap) +5;
          } else if (d.Year == 2000 && d.Country == "Jordan") {
            return yScale(d.Expenditure_per_cap) +5;
          } else if (d.Year == 2001 && d.Country == "Yemen") {
            return yScale(d.Expenditure_per_cap) +7;
          } else if (d.Year == 2001 && d.Country == "Egypt") {
            return yScale(d.Expenditure_per_cap) +2;
          } else if (d.Year == 2002 && d.Country == "Egypt") {
            return yScale(d.Expenditure_per_cap) +10;
          } else if (d.Year == 2002 && d.Country == "Iran") {
            return yScale(d.Expenditure_per_cap) +4;
          } else if (d.Year == 2003 && d.Country == "Egypt") {
            return yScale(d.Expenditure_per_cap) +4;
          } else if (d.Year == 2003 && d.Country == "Syria") {
            return yScale(d.Expenditure_per_cap) +2;
          } else if (d.Year == 2004 && d.Country == "Iraq") {
            return yScale(d.Expenditure_per_cap) +4;
          } else if (d.Year == 2003 && d.Country == "Iran") {
            return yScale(d.Expenditure_per_cap) +2;
          } else if (d.Year == 2005 && d.Country == "Egypt") {
            return yScale(d.Expenditure_per_cap) +10;
          } else if (d.Year == 2005 && d.Country == "Iran") {
            return yScale(d.Expenditure_per_cap) +5;
          } else if (d.Year == 2006 && d.Country == "Egypt") {
            return yScale(d.Expenditure_per_cap) +10;
          } else if (d.Year == 2006 && d.Country == "Iran") {
            return yScale(d.Expenditure_per_cap) +4;
          } else if (d.Year == 2007 && d.Country == "Egypt") {
            return yScale(d.Expenditure_per_cap) +10;
          } else if (d.Year == 2007 && d.Country == "Iraq") {
            return yScale(d.Expenditure_per_cap) +5;
          } else if (d.Year == 2008 && d.Country == "Egypt") {
            return yScale(d.Expenditure_per_cap) +5;
          } else if (d.Year == 2008 && d.Country == "Iraq") {
            return yScale(d.Expenditure_per_cap) +5;
          } else if (d.Year == 2009 && d.Country == "Egypt") {
            return yScale(d.Expenditure_per_cap) +5;
          } else if (d.Year == 2010 && d.Country == "Egypt") {
            return yScale(d.Expenditure_per_cap) +5;
          } else if (d.Year == 2013 && d.Country == "Iran") {
            return yScale(d.Expenditure_per_cap) +5;
          }
          else {
            return yScale(d.Expenditure_per_cap)-5;
          }
        })
        .attr('font-family', 'sans-serif')
        .attr('font-size', '10px')
        .text(function(d){return d.Country});


      svg.select('.x.axis')
        .call(xAxis);

      svg.select('.y.axis')
        .call(yAxis);

      }


  //The
  var LYP = 20;
  var LXP = 20;


    svg.append("circle")
      .attr("cx", LXP)
      .attr("cy", LYP + 10)
      .attr("r", 12).
      style("fill", "green")
      .attr("stroke", "#000");
    svg.append("text")
    .attr("class", "label")
    .attr("x", LXP + 15)
    .attr("y", LYP + 15)
    .style("text-anchor", "start")
    .text("Sunni Majority");

    svg.append("circle")
      .attr("cx", LXP)
      .attr("cy", LYP + 40)
      .attr("r", 12)
      .style("fill", "red")
      .attr("stroke", "#000");
    svg.append("text")
      .attr("class", "label")
      .attr("x", LXP + 15)
      .attr("y", LYP + 45)
      .style("text-anchor", "start")
      .text("Shia' Majority");

    svg.append("circle")
      .attr("cx", LXP)
      .attr("cy", LYP + 70)
      .attr("r", 12)
      .style("fill", "black")
      .attr("stroke", "#000");
    svg.append("text")
      .attr("class", "label")
      .attr("x", LXP + 15)
      .attr("y", LYP + 75)
      .style("text-anchor", "start")
      .text("No Dominant Sect");



  d3.csv("Scatterplot/Middle_East.csv", rowConverter, function(data){

    var data = data;
    // console.log("This is the data: ", data);
    var year =[];
    for (i=0; i <data.length; i++) {
      if (isNaN(data[i].Expenditure_per_cap)) {
        continue
      } else if (isNaN(data[i]["GDP per capita"])){
        continue
      } else if (data[i].Year == 2002) {
        year.push(data[i]);
      }
    }

    // console.log(year);



    runIt(year);


    var slider = document.getElementById("rating");
    slider.addEventListener("change", function() {
      var sliderValue = document.getElementById('rating').value;
      document.getElementById('sliderVal2').innerHTML = sliderValue;
      var year = getYear(data, sliderValue);
      // console.log(year);
      runIt(year);
    })





  });

})();
