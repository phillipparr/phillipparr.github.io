(function(){
  var width = 1000;
  var height = 500;
  var margin = {top: 50, right: 80, bottom: 40,left: 180}
    //define chart margins
    let svg = d3.select("#chart")
    .append("svg")
      .attr('width', width)
      .attr('height', height)

    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    //define time format
    var parseTime = d3.timeParse("%Y");


    //define scales
    let x = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      //color scale
      z = d3.scaleOrdinal(d3.schemeCategory20);

    //define line generator
    let line = d3.line()
      .curve(d3.curveLinear)
      .defined(function (d) { return !isNaN(d.expenditure); })
      .x(function(d) {
        return x(d.Year);
      })
      .y(function(d) {
          return y(d.expenditure);
      });


      function relax(data) {
      var spacing = 16;
      var dy = 2;
      var repeat = false;
      var count = 0;
      data.forEach(function(dA, i) {
          var yA = dA.labelY;
          data.forEach(function(dB, j) {
              var yB = dB.labelY;
              if (i === j) {
                  return;
              }
              diff = yA - yB;
              if (Math.abs(diff) > spacing) {
                  return;
              }
              repeat = true;
              magnitude = diff > 0 ? 1 : -1;
              adjust = magnitude * dy;
              dA.labelY = +yA + adjust;
              dB.labelY = +yB - adjust;
              dB.labelY = dB.labelY > height ? height : dB.labelY
              dA.labelY = dA.labelY > height ? height : dA.labelY
          })
      })
      if (repeat) {
          relax(data);
      }
  }

    //load data
    data = d3.csv("linechart/dataexpenditure.csv", type, function(error, data) {
      if (error) throw error;
      // console.log(data);

      //parse data
      var countries = data.columns.slice(1).map(function(id) {
        return {
          id: id,
          values: data.map(function(d) {
            return {
              Year: d.Year,
              expenditure: d[id]
            };
          })
        };
      });

      // console.log(countries);
      // relax(countries);

      //define x axis
      x.domain(d3.extent(data, function(d) {
        return d.Year;
      }));
      //define y axis
      y.domain([
        d3.min(countries, function(c) {
          return d3.min(c.values, function(d) {
            return d.expenditure;
          });
        }),
        d3.max(countries, function(c) {
          return d3.max(c.values, function(d) {
            return d.expenditure;
          });
        })
      ]);

      //define color scale
      z.domain(countries.map(function(c) {
        return c.id;
      }));

      //append x axis
      g.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      //append y axis
      g.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -150)
        .attr("x", -125)
        .attr("dy", "0.9em")
        .attr("fill", "#000")
        .text("Military expenditure");

      //append country data to svg
      let country = g.selectAll(".country")
        .data(countries)
        .enter()
        .append("g")
        .attr("class", "country")


      // append country path to svg
      country.append("path")
        .attr("class", "line")
        .attr('id', function(d){ return 'line-' + d.id })
        .attr("d", function(d) {return line(d.values); })
        .style("stroke", function(d) {return z(d.id);})
        .attr("opacity", 0);
      // console.log(countries);
      // console.log(country);

      // append country dots to svg
      // var dots = g.selectAll(".dot")
      //       .data(countries)
      //     .enter().append("circle") // Uses the enter().append() method
      //       .attr("class", "dot") // Assign a class for styling
      //       .attr("cx", (function(c) {
      // 				return (c.values, function(d) {return x(d.Year);})
      // 			}))
      //       .attr("cy", (function(c) {
      // 				return (c.values, function(d) {console.log(d.expenditure);return y(d.expenditure);})
      // 			}))
      //       .attr("r", 3);

      var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

      g.selectAll(".dot")
              .data(countries)
              .enter().append("g")
              .attr("class", "dot")
              .attr('id',function(d){return 'dot-' + d.id;}
              )
              .style("fill", function(d) {return z(d.id);})
              .attr("opacity", 0)
              .selectAll("circle")
              .data(function(d) { return d.values; })
              .enter().append("circle")
              .attr("r", function(d){
                if(isNaN(y(d.expenditure))) {
                  return 0;
                } else {
                  return 2.5;
                }
              })
              .attr("cx", function(d,i) { return x(d.Year); })
              .attr("cy", function(d,i) { return y(d.expenditure); })
              // .attr('fill', function(d) {return z(d.id);})
              .on("mouseover", function(d) {
								// var mouse_position = d3.mouse(this);
                //   tooltip.transition()
                //       .duration(200)
                //       .style("opacity", 1);
                //   tooltip.text(d.expenditure + " Millions($)")
                //       .attr("x", (mouse_position[0]) + "px")
                //       .attr("y", (mouse_position[1]) + "px");
								tooltip.transition()
			                .duration(200)
			                .style("opacity", 1);
			            tooltip.html("$"+d.expenditure + "(M)")
			                .style("left", (d3.event.pageX) + "px")
			                .style("top", (d3.event.pageY - 28) + "px");
			            })
              .on("mouseout", function(d) {
                  tooltip.transition()
                      .duration(500)
                      .style("opacity", 0);
              });



      // append country labels to svg
      country.append("text")
        // .datum(function(d) {console.log(d.values[d.values.length]); return { id: d.id, value: d.values[d.values.length - 1]}; })
        .datum(function(d) {
          for(var i = d.values.length-1; i >= 0; i--) {
            if(!isNaN(d.values[i].expenditure)) {
              console.log({id: d.id, value: d.values[i]});
              return {id: d.id, value: d.values[i]};
            }
          }
          return undefined;
        })
        .style("fill", function(d) {return z(d.id);})
        .attr("transform", function(d) {
          console.log(d);
          return "translate(" + x(d.value.Year) + "," + y(d.value.expenditure) + ")"; })
          .attr("x", function(d){
                           if((d.id == "Israel")|| (d.id == "Jordan")|| (d.id == "Iran") ||(d.id == "Bahrain")){
                             return 8;
                           }else if(d.id == "Iraq") {
                             return -32;
                           }else if (d.id == "Bahrain") {
                             return 4;
                           }else if (d.id == "Yemen") {
                             return 1;
                           }else if(d.id == "Jordan") {
                             return 1;
                           }
                           else{
                             return 8;
                           }
                       })


        // .attr("x", 8)
        .attr('id', function(d){ return 'text-' + d.id })
        .attr("dy", function(d){
                         if(d.id == "Jordan") {
                           return "-0.15em";
                         }else if (d.id == "Iraq") {
                           return "-0.30em";
                         }else if (d.id == "Yemen") {
                           return "-0.35em";
                         }
                         else if (d.id == "Kuwait") {
                           return "0.05em";
                         }else if (d.id == "Bahrain") {
                           return "0.75em";
                         }else{
                           return "0.35em";
                         }
                     })
        .style("font", "11px sans-serif")
        .attr("opacity", 0)
        .text(function(d) { return d.id; });

      for (let i = 0; i < countries.length; i++) {
        var tick = document.createElement('input');
        tick.type = 'checkbox';
        tick.class = 'myCheckbox';
        tick.name = countries[i].id;
        tick.value = countries[i].id;

        var label = document.createElement('label');
        label.for = countries[i].id
        label.appendChild(document.createTextNode(countries[i].id));
        // tick.appendChild(document.createTextNode(countries[i].id));
        document.getElementById("menu1").appendChild(tick);
        document.getElementById("menu1").appendChild(label);
        tick.addEventListener("click", function() {

          var lineSelected = this.value;
          var svgline = d3.select('#line-' + lineSelected);
          var textline = d3.select('#text-' + lineSelected);
          var dotline = d3.select('#dot-' + lineSelected);


          if(svgline.attr('opacity') === '0') {
            // console.log('making it visible');
            svgline.attr('opacity', 1);
          } else {
            svgline.attr('opacity', 0);
          }

          if(textline.attr('opacity') === '0') {
            // console.log('making it visible');
            textline.attr('opacity', 1);
          } else {
            textline.attr('opacity', 0);
          }
          if(dotline.attr('opacity') === '0') {
            // console.log('making it visible');
            dotline.attr('opacity', 1);
          } else {
            dotline.attr('opacity', 0);
          }
          this.style.background = '#555';
          this.style.color = 'white';

        });
      }

    });

    //bind with multiseries data
    function type(d, _, columns) {
      d.Year = parseTime(d.Year);
      //iterate through each column
      for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];

      //bind column data to year
      return d;
    }

})();
