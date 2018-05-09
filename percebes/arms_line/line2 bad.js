(function(){
  var rowConverter = function(d) {
      return {
        "Exporting Country": d["Exporting Country"],
        Year: parseInt(d.Year),
        "Exports in Millions": parseInt(d["Exports in Millions"]),
        "Importing Country": d["Importing Country"]
      };
  }

          var width = 1000;
          var height = 600;

          var container = d3.select('#line_chart_1')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);


          var margin = {
            top: 20,
            left: 200,
            right: 200,
            bottom: 70
          };

          width = width - margin.left - margin.right;
          height = height - margin.top - margin.bottom;

          var svg = container.append('g')
                .attr('class','content')
                .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

          var x_scale = d3.scaleTime()
                .range([0,width]);

          var y_scale = d3.scaleLinear()
                .range([height,0]);

          var z = d3.scaleOrdinal(d3.schemeCategory20);;

          var xAxis = d3.axisBottom(x_scale);

          var yAxis = d3.axisLeft(y_scale);

          var parseTime = d3.timeParse("%Y");


          Total();
           var total = document.createElement('input');
           total.type = 'button';
           total.className = 'button';
           total.value = 'Total';
           document.getElementById("button").appendChild(total);
           total.addEventListener("click", function() {
             d3.selectAll("li").remove();
             d3.select("#line_chart_1").select("svg").remove();

             width = 2000;
             height = 900;

             svg = d3.select('#line_chart_1')
                . append('svg')
                . attr('width', width)
                . attr('height', height)
                . append('g')
                . attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

              width = width - margin.left - margin.right;
              height = height - margin.top - margin.bottom;

                  Total();
           });
           var single = document.createElement('input');
           single.type = 'button';
           single.className = 'button';
           single.value = 'Countries';
           document.getElementById("button").appendChild(single);
           single.addEventListener("click", function() {
             d3.select("#line_chart_1").select("svg").remove();

             width = 2000;
             height = 900;

             svg = d3.select('#line_chart_1')
                . append('svg')
                . attr('width', width)
                . attr('height', height)
                . append('g')
                . attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

              width = width - margin.left - margin.right;
              height = height - margin.top - margin.bottom;

                Single();
           });

  ////////////////////////  Total /////////////////////////////

  function Total(){
    // get the dataset.
    d3.csv("Import_line (latest)/Middle East Imports.csv",  rowConverter,function(data){

        console.log(data);
    //converting the dataset
       total_data = d3.nest()
        .key(function(d){return d.Year;})
        .rollup(function(d){
          return d3.sum(d, function(e){
            return e['Exports in Millions'];
          })
        })
        .object(data);

       console.log(total_data);

       sum = [];
       for(var d in total_data){
         sum.push({'year':parseTime(d),'exports_in_millions':total_data[d]});
       }

       console.log(sum)

       x_scale.domain(d3.extent(sum, function(d) { return d.year; }));

       y_scale.domain([0, d3.max(sum, function(d) { return d.exports_in_millions; })]);

       svg.append("g")
         .attr("class", "axis axis-x")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis)
         .append("text")
         .attr("y", 65)
         .attr("x", width+ 5)
         .attr("fill", "#000")
         .attr("font","sans-serif")
         .text("Year");

       //append y axis
       svg.append("g")
         .attr("class", "axis axis-y")
         .call(yAxis)
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", -150)
         .attr("x", -150)
         .attr("dy", "1.2em")
         .attr("fill", "#000")
         .attr("font","sans-serif")
         .text("Exports in Millions");

       var path = svg.selectAll(".line")
          .data(sum);

       var line = d3.line()
             .x(function(d) { return x_scale(d.year); })
             .y(function(d) { return y_scale(d.exports_in_millions); })
             .curve(d3.curveCatmullRom);

       var path = svg.append("path")
             .attr('class', 'line')
             .attr("d", line(sum))
             .style("stroke", function(d) {return z(d);})
             .attr("opacity", 1);


       //labels
       var labels = svg.selectAll(".label")
             .data(sum)
             .enter()
             .append('text')
             .attr('class','label')
             .attr("x",function(d,i){ return x_scale(d.year);})
             .attr("y",function(d,i){ return y_scale(d.exports_in_millions);})
             .text(function(d){ return d.exports_in_millions })
             .attr("transform", function(d) { return "translate(-20,30)"; })
             .style("font", "23px sans-serif");

       // the dots on the line.
       var circles = svg.selectAll(".circle")
             .data(sum)
             .enter().append("circle")
             .attr('cx', function(d) {
                 return x_scale(d.year);
             })
             .attr('cy', function(d) {
                 return y_scale(d.exports_in_millions);
             })
             .attr('r', 5);

       svg.select('.x.axis')
             .call(xAxis);

       svg.select('.y.axis')
             .call(yAxis);

           });
  };
  ///////////////////////// Single ////////////////////////
  function Single(){

    d3.csv("Import_line (latest)/Middle East Imports.csv",  rowConverter,function(data){

        console.log(data);
    //converting the dataset Single countries.
       alldata = d3.nest()
        .key(function(d){return d["Importing Country"]})
        .key(function(d){return d.Year;})
        .rollup(function(d){
          return d3.sum(d, function(e){
            return e['Exports in Millions'];
          })
        })
        .object(data);

       console.log(alldata);

       graph_data = [];
       for(var d in alldata){
         graph_data.push({'country':d,'detail':alldata[d]});
       }

       // console.log(graph_data)


         // parse data
       var countries = graph_data.map(function(id) {
           var values = [];
           // console.log(id);
           for (var key in id.detail) {
             values.push({
               year: parseTime(key),
                 exports_in_millions: id.detail[key]
             });
           }
           return {
             id: id.country,
             value: values
           };
         });
          console.log(countries)
          ///////////////////////////////////////////////////////////////
          ///////////   chart    ////////////////////////////////////////
          // function draw_line(){
            var max_years = countries.map(function(d){
              return d3.max(d.value, function(e){
                return e.year;
              })
            })
            var min_years = countries.map(function(d){
              return d3.min(d.value, function(e){
                return e.year;
              })
            })

            var max_year = d3.max(max_years);
            var min_year = d3.min(min_years);

            x_scale.domain([min_year, max_year]);
            // console.log(x_scale.domain());
            //define y axis
            y_scale.domain([0,	d3.max(countries, function(c) {
                return d3.max(c.value, function(d) {
                  return d.exports_in_millions;
                });
              })
            ]);
            //define color scale
            z.domain(countries.map(function(c) {
              return c.id;
            }));
            // console.log(z.domain())

            //////////////  setting x axis.  //////////

            svg.append("g")
              .attr("class", "axis axis-x")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
              .append("text")
              .attr("y", 65)
              .attr("x", width+ 5)
              .attr("fill", "#000")
              .attr("font","sans-serif")
              .text("Year");

            //append y axis
            svg.append("g")
              .attr("class", "axis axis-y")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", -150)
              .attr("x", -150)
              .attr("dy", "1.2em")
              .attr("fill", "#000")
              .attr("font","sans-serif")
              .text("Exports in Millions");
    ///////////////////    lines      //////////////////////

            let line = d3.line()
              .defined(function(d) {return d.exports_in_millions !== 0})
              .x(function(d) {return x_scale(d.year);})
              .y(function(d) {return y_scale(d.exports_in_millions);})
              .curve(d3.curveCatmullRom);
              console.log('countries', countries)


            //append country data to svg
            var path = svg.selectAll(".line")
                .data(countries)
                .enter()
                .append("g")
                .attr("class", "country");


            // append country path to svg
            path.append("path")
              .attr("class", "line")
              .attr("d", function(d){
                return line(d.value);
              })
              .attr('id',function(d){
                if(d.id == "Saudi Arabia"){
                  return'line-Saudi_Arabia';
                }else{
                  return 'line-' + d.id;
                }
              })
              .style("stroke", function(d) {return z(d.id);})
              .attr("opacity", 0);


            // append country labels to svg
              path.append("text")
                .datum(function(d) { return {id: d.id, value: d.value[d.value.length - 1]}; })
                .attr("transform", function(d) { return "translate(" + x_scale(d.value.year) + "," + y_scale(d.value.exports_in_millions) + ")"; })
                // .attr("x", 20)
                // .attr("dy", "0.30em")
                .attr("x", function(d){
                    if((d.id == "Jordan")|| (d.id == "Iran") ||(d.id == "Bahrain")){
                      return -1750;
                    }else if( (d.id == "Israel")||(d.id == "Syria")) {
                      return -1700;
                    }else if (d.id == "Palestine") {
                      return -200;
                    }else if (d.id == "Yemen") {
                      return 30;
                    }else{
                      return 20;
                    }
                })
                .attr("y", function(d){
                  if(d.id == "Yemen"){
                    return "1.5em"
                  }else if (d.id == "Turkey") {
                    return "-0.8em"
                  }else if(d.id == "Syria"){
                    return "-10.5em"
                  }else if (d.id == "Palestine") {
                    return "2em"
                  }else{
                    return "0.30em"
                  }
                })
                .style("font", "30px sans-serif")
                .style("stroke", function(d) {return z(d.id);})
                .attr("opacity", 0)
                .text(function(d) { return d.id; })
                .attr("class", "label")
                .attr('id',function(d){
                  if(d.id == "Saudi Arabia"){
                    return'label-Saudi_Arabia';
                  }else{
                    return 'label-' + d.id;
                  }
                });


          var tooltip = d3.select("body")
              .append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);

          svg.selectAll(".dot")
                .data(countries)
                .enter().append("g")
                .attr("class", "dot")
                .attr('id',function(d){
                  if(d.id == "Saudi Arabia"){
                    return'dot-Saudi_Arabia';
                  }else{
                    return 'dot-' + d.id;
                  }
                })
                .style("fill", function(d) {return z(d.id);})
                .attr("opacity", 0)
                .selectAll("circle")
                .data(function(d) { return d.value; })
                .enter().append("circle")
                .attr("r", function(d){
                  if(y_scale(d.exports_in_millions) === height) {
                    return 0;
                  } else {
                    return 6;
                  }
                })
                .attr("cx", function(d,i) { return x_scale(d.year); })
                .attr("cy", function(d,i) { return y_scale(d.exports_in_millions); })
                .on("mouseover", function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);
                    tooltip.html(d.exports_in_millions + " Millions($)")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                    })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });


            for (let i = 0; i < countries.length; i++) {
              var list = document.createElement("li");
              var tick = document.createElement('input');
              tick.type = 'checkbox';
              tick.class = 'myCheckbox';
              if(countries[i].id == "Saudi Arabia"){
                tick.name = "Saudi_Arabia"
                tick.value = "Saudi_Arabia";
              }else{
                tick.name = countries[i].id;
                tick.value = countries[i].id;
              }
              console.log(tick);
              // var label = document.createElement('label');
              // label.for = countries[i].id
              // label.appendChild(document.createTextNode(countries[i].id));
              list.appendChild(tick);
              list.appendChild(document.createTextNode(countries[i].id));
              document.getElementById("menu").appendChild(list);
              // document.getElementById("menu").appendChild(label);
              tick.addEventListener("click", function() {
                //line's click
                console.log(this);
                var lineSelected = this.value;
                console.log(lineSelected)
                var svgline = d3.select('#line-' + lineSelected)
                console.log(svgline);
                console.log(svgline.attr('opacity'));
                if(svgline.attr('opacity') === '0') {
                  console.log('making it visible');
                  svgline.attr('opacity', 1);
                } else {
                  svgline.attr('opacity', 0);
                };
                //label's click
                var labelSelected = this.value;
                console.log(labelSelected)
                var labelline = d3.select('#label-' + labelSelected);
                console.log(labelline);
                console.log(labelline.attr('opacity'));
                if(labelline.attr('opacity') === '0') {
                  console.log('making it visible');
                  labelline.attr('opacity', 1);
                } else {
                  labelline.attr('opacity', 0);
                }

                //circle's click
                var DotSelected = this.value;
                console.log(DotSelected)
                var Dotline = d3.select('#dot-' + DotSelected);
                console.log(Dotline);
                console.log(Dotline.attr('opacity'));
                if(Dotline.attr('opacity') === '0') {
                  console.log('making it visible');
                    Dotline.attr('opacity', 1);
                } else {
                  Dotline.attr('opacity', 0);
                }
                });
        };
  });

  }


})();
