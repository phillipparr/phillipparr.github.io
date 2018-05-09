
var rowConverter = function(d) {
    return {
      "Exporting Country": d["Exporting Country"],
      Year: parseInt(d.Year),
      "Exports in Millions": parseInt(d["Exports in Millions"]),
      "Importing Country": d["Importing Country"]
    };
}

var width = 950;
var height = 500;

var container1 = d3.select('#line_chart_1')
          .append('svg')
          .attr('width', width)
          .attr('height', height);


var margin = {
  top: 20,
  left: 120,
  right: 100,
  bottom: 50
};

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var g = container1.append('g')
      .attr('class','content')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

var x = d3.scaleTime()
      .range([0,width]);

var y = d3.scaleLinear()
      .range([height,0]);

var z = d3.scaleOrdinal(d3.schemeCategory20);;

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);


// get the dataset.
d3.csv("Middle East Imports.csv",  rowConverter,function(data){

    console.log(data);
//converting the dataset
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

   var parseTime = d3.timeParse("%Y");

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

        x.domain([min_year, max_year]);
        console.log(x.domain());
  			//define y axis
  			y.domain([0,	d3.max(countries, function(c) {
  					return d3.max(c.value, function(d) {
  						return d.exports_in_millions;
  					});
  				})
  			]);
  			//define color scale
  			z.domain(countries.map(function(c) {
  				return c.id;
  			}));
        console.log(z.domain())

        //////////////  setting x axis.  //////////
        //append x axis
  			g.append("g")
  				.attr("class", "axis axis-x")
  				.attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("y", 40)
  				.attr("x", width+10)
          .attr("fill", "#000")
          .attr("font","sans-serif")
          .text("Year");

  			//append y axis
        g.append("g")
  				.attr("class", "axis axis-y")
          .call(yAxis)
  				.append("text")
  				.attr("transform", "rotate(-90)")
  				.attr("y", -80)
  				.attr("x", -125)
  				.attr("dy", "0.9em")
  				.attr("fill", "#000")
          .attr("font","sans-serif")
  				.text("Exports in Millions");

        let line = d3.line()
          .x(function(d) {return x(d.year);})
          .y(function(d) {return y(d.exports_in_millions);})
          .curve(d3.curveCatmullRom);
          console.log('countries', countries);
  			//append country data to svg
        var path = g.selectAll(".line")
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
  				.attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.exports_in_millions) + ")"; })
  				.attr("x", 3)
  				.attr("dy", "0.35em")
  				.style("font", "18px sans-serif")
  				.text(function(d) { return d.id; })
          .attr("class", "label")
  				.attr('id',function(d){
            if(d.id == "Saudi Arabia"){
              return'label-Saudi_Arabia';
            }else{
              return 'label-' + d.id;
            }
          })
          .style("stroke", function(d) {return z(d.id);})
          .attr("opacity", 0);


      ////////////  button's click  //////////////////
        var ul = document.createElement("ul");
        var total = document.createElement("input");
        total.type = 'button';
        total.value = 'See all';
        document.getElementById("menu").appendChild(total);
        total.addEventListener("click", function() {
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
            .attr("opacity", 1);

          path.append("text")
            .datum(function(d) { return {id: d.id, value: d.value[d.value.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.exports_in_millions) + ")"; })
            .attr("x", 3)
            .attr("dy", "0.35em")
            .style("font", "18px sans-serif")
            .text(function(d) { return d.id; })
            .attr("class", "label")
            .attr('id',function(d){
              if(d.id == "Saudi Arabia"){
                return'label-Saudi_Arabia';
              }else{
                return 'label-' + d.id;
              }
            })
            .style("stroke", function(d) {return z(d.id);})
            .attr("opacity", 1);

            // document.getElementsByClassName("country");
            // total.addEventListener("click", function() {
            //   if(path.attr('opacity')===1){
            //     path.attr('opacity',0);
            //     text.attr('opacity',0);
            //   }else{
            //     path.attr('opacity',1);
            //     text.attr('opacity',0);
            //   }
            //
            // })

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
  					var svgline = d3.select('#line-' + lineSelected);
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


            });
        }


      //define time format



    });
