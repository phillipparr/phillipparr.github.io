//Show content
function show_content() {
    var main = document.getElementById('content');
    main.style.display = "block";
    var about = document.getElementById('about');
    about.style.display = "none";
    var footer = document.getElementById('footer');
    footer.style.display = "none";

}

//City names

var url = 'https://api.teleport.org/api/urban_areas/';

  fetch(url)
      .then(function(response) {
        return response.json();
      })

     .then(function(data) {
        var results = data._links["ua:item"];
        citylist(results);

        var citynames = [];
        for (var i=0; i < results.length; i++) {
          citynames.push(results[i])
        }
        dropdown(citynames);
      });

//trying to access the list of cities in the variable "results" from the function
//above outside of that function to use it as the parameter for the API requests below
  var citylist = function(array) {
    var randomCity = array[Math.floor(Math.random()*array.length)];
    console.log(randomCity);
    teleportAPI(randomCity.href);
    newsAPI(randomCity.name);
    weatherAPI(randomCity.name);
    document.getElementById('random').addEventListener('click', function(){
      var randomCity = array[Math.floor(Math.random()*array.length)];
      console.log(randomCity);
      teleportAPI(randomCity.href);
      newsAPI(randomCity.name);
      weatherAPI(randomCity.name);
      })
  }
// Dropdown
function dropdown(cities) {
  for (let i=0; i < cities.length; i++) {
    var menuItem = document.createElement('li');
    // menuItem.href = cities[i].href;
    menuItem.appendChild(document.createTextNode(cities[i].name));
    document.getElementById("dropdown").appendChild(menuItem);
    menuItem.addEventListener('click', function(){
      teleportAPI(cities[i].href);
      newsAPI(cities[i].name);
      weatherAPI(cities[i].name);
    })
  }

}

//QOL SCORES
var assembleKey = function(parameters) {
  var para_list = [];
  for (var key in parameters) {
    if (parameters.hasOwnProperty(key)) {
      var para_string = encodeURIComponent(key) + ":" + encodeURIComponent(parameters[key]);
      para_list.push(para_string);
    }

 }
  return para_list;
}

function teleportAPI(city) {
  var query_url = city +"scores/";
      console.log(query_url);

     fetch(query_url)
        .then(function(response) {
          return response.json();
        })

       .then(function(data) {
          var results = data.categories;
          var results1 = data.teleport_city_score;
          var intvalue = Math.round(results1);
          var intscores = function(results) {
            var intscores = [];
            for (var i in results) {
              intscore = Math.round(results[i].score_out_of_10);
              intscores.push(intscore);
            }
            return intscores;
          };
          var roundedScores = intscores(results);
          document.getElementById("housing").innerHTML = "Housing: " + roundedScores[0];
          document.getElementById("cost_of_living").innerHTML = "Cost Of Living: " + roundedScores[1];
          document.getElementById("safety").innerHTML = "Safety: " + roundedScores[7];
          document.getElementById("economy").innerHTML = "Economy: " + roundedScores[11];
          document.getElementById("leisure_culture").innerHTML = "Leisure & Culture: " + roundedScores[14];
          document.getElementById("healthcare").innerHTML = "Healthcare: " + roundedScores[8];
          document.getElementById("environmental_quality").innerHTML = "Environmental Quality: " + roundedScores[10];
          document.getElementById("total_city_score").innerHTML = "Quality of Life Score: " + intvalue;
        });
}

// NEWS API Key: Your API key is: d629a7dfe79f4f86a47daf27e5a39c53
var assembleKey1 = function(parameters) {
  var para_list = [];
  for (var key in parameters) {
    if (parameters.hasOwnProperty(key)) {
      var para_string = encodeURIComponent(key) + "=" + encodeURIComponent(parameters[key]);
      para_list.push(para_string);
    }

 }
  return para_list.join("&");

}
function newsAPI(city) {
  var url = 'https://newsapi.org/v2/everything';
  let parames = {
    q:city,
    from:"2017-12-01",
    sortBy: "popularity",
    apiKey: "d629a7dfe79f4f86a47daf27e5a39c53"
  }

  var query_url = url + "?" + assembleKey1(parames);
      console.log(query_url);




     fetch(query_url)
        .then(function(response) {
          return response.json();
        })

       .then(function(data) {
          var results = data.articles;
          console.log(results);
          document.getElementById("cityname").innerHTML = city

          for(let i = 0; i < 6; i++) {
            var link = document.createElement('a');
            link.setAttribute('target','_blank')
            link.href = results[i].url;
            link.appendChild(document.createTextNode(results[i].title));
            if(document.getElementById("article" + (i+1)).hasChildNodes()) {
                var articlediv = document.getElementById("article" + (i+1));
                var oldlink = articlediv.childNodes[0];
                articlediv.replaceChild(link, oldlink);
            } else {
              document.getElementById("article" + (i+1)).appendChild(link);
            }

          }
        });
  }
//Weather API Key: Your API Key: e324ec4975e24b42a5dc26acf9346d20
function weatherAPI(city) {
  var url = 'http://api.weatherbit.io/v2.0/current';
  let paramets = {
    city:city,
    key: "e324ec4975e24b42a5dc26acf9346d20"
  }

  var query_url = url + "?" + assembleKey1(paramets);
      console.log(query_url);




     fetch(query_url)
        .then(function(response) {
          return response.json();
        })

       .then(function(data) {
          var temp = data.data[0].app_temp;
          var description = data.data[0].weather.description;
          var wind_speed = data.data[0].wind_spd;
          var wind_dir = data.data[0].wind_cdir_full;
          var precip=data.data[0].precip;
          var sunrise = data.data[0].sunrise;
          var sunset=data.data[0].sunset;
          var date_time=data.data[0].ob_time;
          var results = data;
          console.log(wind_speed);
          console.log(wind_dir);
          console.log(results);
          document.getElementById("temp").innerHTML = "Temperature: " + temp + " Celsius";
          document.getElementById("description").innerHTML = "Description: " + description;
          document.getElementById("rain").innerHTML = "Precipitation: " + precip + " mm";
          document.getElementById("wind_speed").innerHTML = "Wind Speed: " + wind_speed + " m/s";
          document.getElementById("wind_dir").innerHTML = "Wind Direction: " + wind_dir;
          document.getElementById("sunrise").innerHTML = "Sunrise: " + sunrise + "GMT";
          document.getElementById("sunset").innerHTML = "Sunset: " + sunset + "GMT";
          document.getElementById("date_time").innerHTML = "Date & Time: " + date_time;
        });
}