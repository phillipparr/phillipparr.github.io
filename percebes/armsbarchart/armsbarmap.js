(function(){
  var rowConverter = function(d) {
    return {
      "Exporting Country": d["Exporting Country"],
      Year: parseFloat(d.Year),
      "Exports in Millions": parseFloat(d["Exports in Millions"]),
      "Importing Country": d["Importing Country"]
    };
  }

  //Get that data
  d3.csv("armsbarchart/Middle East Imports.csv", rowConverter, function(data){
  // Write a function that finds which years/countries have data and then use that
  // to make the slider move to the nearest year with data

  var country_names = []
  data.forEach(function(d){
    if(country_names.indexOf(d["Importing Country"]) === -1) {
      country_names.push(d["Importing Country"]);
    }
  });

  console.log(country_names);
  //create bar svg stuff
    var width = 500;
    var height = 400;

    var margin = {
      top: 60,
      left: 150,
      right: 0,
      bottom: 60
    };

    var svg = d3.select("#barchart")
        .append("svg")
        .attr('width', width)
        .attr('height', height)
        .append("g")
        .attr('transform','translate(' + margin.left + ',' + margin.top +')');

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    var x_scale = d3.scaleLinear()
      .range([0,width]);


    var y_scale = d3.scaleBand()
      .range([0,height])
      .paddingInner(0.1);

    var x_axis = d3.axisBottom(x_scale);

    var y_axis = d3.axisLeft(y_scale);

    svg.append('g')
        .attr('transform','translate(0, ' + height +')')
        .attr('class','x axis');

    svg.append('g')
        .attr('class','y axis');
  // Labels
    svg.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .attr("y", -110)
          .attr("x",-120)
          .text("Exporting Country");

    svg.append("text")
                .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr("transform", "translate("+ (width/2) +","+(height + (margin.bottom/1.5))+")")  // centre below axis
                .text("Value of Exports in Millions (USD)");

  //colors
    var colors = colorbrewer.Blues[9];
    colors = colors.slice(2,9);
    var color_scale = d3.scaleQuantile()
        .range(colors)

  //Map svg
    var map_width = 700,
        map_height = 575;

    var map_margin = {
      top: 160,
      left: 250,
      right: 0,
      bottom: 20
    };
    var map_svg = d3.select("#map").append("svg")
        .attr("width", map_width)
        .attr("height", map_height)
        .append("g")
        .attr('transform','translate(' + map_margin.left + ',' + map_margin.top +')');

    map_width = map_width - map_margin.left - map_margin.right;
    map_height = map_height - map_margin.top - map_margin.bottom;

    var tooltip = d3.select("#map")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  //Barchart function
    function draw(country) {


      x_scale.domain([0, d3.max(country, function(d){return d.value;})]);

      y_scale.domain(country.map(function (d){ return d.country; }));


      var bars = svg.selectAll(".bar")
         .data(country);

      bars
          .exit()
          .remove();

      var new_bars = bars
          .enter()
          .append('rect')
          .attr('class','bar')
          .attr('fill', 'blue')
          .attr('width', '20px')
          .on("mouseover", function(d) {
            tooltip.transition()
              .duration(200)
              .style("opacity", .9);
            tooltip.html("$"+d.value+"(M)")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
            tooltip.transition()
              .duration(500)
              .style("opacity", 0);
    });

      new_bars.merge(bars)
          .attr('height', function(d, i) {return y_scale.bandwidth()})
          .attr('width', function(d, i) {return x_scale(d.value)})
          .attr("y", function(d, i){ return y_scale(d.country); })
          .attr("x", function(d, i){ return 0});


      svg.select('.x.axis')
          .call(x_axis);

      svg.select('.y.axis')
          .call(y_axis);

    }
  //Color function for map
    function magic_colour_function(country_data, country_name) {
      for(var i = 0; i < country_data.length; i++) {
        if(country_data[i].country === country_name) {

          return color_scale(country_data[i].value);
        }
      }
      return '#ddd';

    }
  //Get the values
    function value_function(country_data, country_name) {
      for(var i = 0; i < country_data.length; i++) {
        if(country_data[i].country === country_name) {

          return country_data[i].value;
        }
      }
      return -1;

    }
  //Map function
    function map(country) {

      d3.json("armsbarchart/world.json", function(error, world) {
        if (error) return console.error(error);

        var projection = d3.geoMercator()
          .center([0, 55.4])
          .rotate([4.4, 0])
          .scale(100)
          .translate([width / 4, height / 4]);

        var path = d3.geoPath()
          .projection(projection);


        var countries = map_svg.selectAll(".country")
            .data(topojson.feature(world, world.objects.countries).features);

        var new_countries = countries
          .enter().append("path")
            .attr("class", "country")



        new_countries.merge(countries)
            .attr("d", path)
            .attr('fill', function(d){
              return magic_colour_function(country, d.properties.name)
            })
            .on("mouseover", function(d) {

                let this_value = value_function(country, d.properties.name);
                if(this_value !== -1) {
                  tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                    d3.select(this).attr('fill', 'steelblue');
                  tooltip.html(d.properties.name + ": " + "$" + this_value + "(M)")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                }

              })
              .on("mouseout", function(d) {
                d3.select(this).attr('fill', magic_colour_function(country, d.properties.name));
                tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
              });


        map_svg.append("path")
          .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b && a.id !== "IRL"; }))
          .attr("d", path)
          .attr("class", "country-boundary");

          const elements = document.getElementsByClassName("legend");
          while (elements.length > 0 ) elements[0].remove();
          var legend = map_svg.selectAll('.legend')
                      .data(colors);


          var new_legend = legend
              .enter()
              .append('g')
              .attr('class', 'legend');

          new_legend.merge(legend)
              .append('rect')
              .attr('width', 20)
              .attr('height', 20)
              .attr('x', 0 - margin.left)
              .attr('y', function(d, i){ return height + 60 -(i*20)})
              .attr('fill', function(d){ return d})
              .attr('stroke', 'black')
              .attr('stroke-width', '0.5px');

          new_legend.merge(legend)
              .append('text')
              .attr('x', 0 - margin.left - 60)
              .attr('y', function(d, i) { return height +73 - (i *20)})
              .text(function(d) {
                var low = Math.round(color_scale.invertExtent(d)[0]);
                var high = Math.round(color_scale.invertExtent(d)[1]);
                return low + ' - ' + high;
              });
          });
        }

  // Get the data function to plug into the draw functions
        function filter(country, year) {


          filtered_data = data.filter(function(d){
            return d["Importing Country"] === country;
          })


          filtered_data1 = filtered_data.filter(function(d){
            return d["Year"] === year;
          })


  //Turn it into an object
          summed_data1 = {};
          filtered_data1.forEach(function(d){
            summed_data1[d["Exporting Country"]] = d["Exports in Millions"];
          })
  //Turn it into an array
          graph_data1 = [];
          for(var d in summed_data1){
            if (isNaN(summed_data1[d])) {
              continue;
            } else {
            graph_data1.push({'country': d, 'value': summed_data1[d]});
            }
          }

  //Get the values for the color scale
          var value_data = [];
          for(var i in graph_data1){
            value_data.push(graph_data1[i].value)
          }
          var min = d3.min(value_data),
              max = d3.max(value_data);
          color_scale.domain([min, max]);

          return graph_data1;

        }
  //Initial display
        var country = filter("Iraq", 2004)
        // console.log(country)

        draw(country);
        map(country);



  //Dropdown change function
          var countries = country_names;
          for (let i=0; i < countries.length; i++) {
            let menuItem = document.createElement("li");
            menuItem.appendChild(document.createTextNode(countries[i]));
            document.getElementById("dropdown").appendChild(menuItem);
            menuItem.addEventListener("click", function(){
              document.getElementById("title").innerHTML = countries[i];
              var sliderValue = +document.getElementById("year").value;
              country = document.getElementById("title").innerHTML
              while(!hasData(country, sliderValue) && (sliderValue < 2016)) {
                sliderValue += 1;
              }
              console.log(countries[i])
              filtered_data = filter(country, sliderValue);
              console.log(filtered_data)
              document.getElementById('sliderVal').innerHTML = sliderValue;

                draw(filtered_data);
                map(filtered_data);

            });
          }

          function change_data(){
            // get the country from the selected menu
            // get the year from the slider value
            // check we have data, if not find another year
            // filter the datae
            // draw stuff

          }


          function hasData(country, year) {
            filtered_data = filter(country, year);
            if(filtered_data.length === 0) {
              return false
            } else {
              return true;
            }
          }
  //Slider change function
        var slider = document.getElementById("year");
        slider.addEventListener("change", function() {
          var sliderValue = +document.getElementById("year").value;
          country = document.getElementById("title").innerHTML
          while(!hasData(country, sliderValue) && (sliderValue < 2016)) {
            sliderValue += 1;
          }
          filtered_data = filter(country, sliderValue);
          document.getElementById('sliderVal').innerHTML = sliderValue;
          draw(filtered_data);
          map(filtered_data);
          });
      });

})();
