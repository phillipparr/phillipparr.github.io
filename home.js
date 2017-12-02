//City names

var url = 'https://api.teleport.org/api/urban_areas/';

  fetch(url)
      .then(function(response) {
        return response.json();
      })

     .then(function(data) {
        var results = data._links["ua:item"];
        var cities =[]
        for (var i=0; i < results.length; i++) {
          cities.push(results[i].name)
        }
        citylist(cities);
      });

//trying to access the list of cities in the variable "results" from the function
//above outside of that function to use it as the parameter for the API request below
  var citylist = function(array) {
    console.log(array);
  }

// var cities = citylist();
// var randomItem = cities[Math.floor(Math.random()*cities.length)];
// console.log(randomItem);
//QOL SCORE
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

var url = 'https://api.teleport.org/api/urban_areas/';
let params = {
  slug:"cardiff",
}

var query_url = url + assembleKey(params) +"/scores/";
    console.log(query_url);





   fetch(query_url)
      .then(function(response) {
        return response.json();
      })

     .then(function(data) {
        var results = data.categories;
        var results1 = data.teleport_city_score;
        var intvalue = Math.round(results1);
        console.log(results);
        console.log(results1)
        var intscores = function(results) {
          var intscores = [];
          for (var i in results) {
            intscore = Math.round(results[i].score_out_of_10);
            intscores.push(intscore);
          }
          return intscores;
        };
        var roundedScores = intscores(results);
        console.log(intscores);
        document.getElementById("housing").innerHTML = "Housing: " + roundedScores[0];
        document.getElementById("cost_of_living").innerHTML = "Cost Of Living: " + roundedScores[1];
        document.getElementById("safety").innerHTML = "Safety: " + roundedScores[7];
        document.getElementById("economy").innerHTML = "Economy: " + roundedScores[11];
        document.getElementById("leisure_culture").innerHTML = "Leisure & Culture: " + roundedScores[14];
        document.getElementById("healthcare").innerHTML = "Healthcare: " + roundedScores[8];
        document.getElementById("environmental_quality").innerHTML = "Environmental Quality: " + roundedScores[10];
        document.getElementById("total_city_score").innerHTML = "Quality of Life Score: " + intvalue;
      })
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

var url = 'https://newsapi.org/v2/everything';
let parames = {
  q:"cardiff",
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
        //I managed to add the title but I want to add the links...
        console.log(results);
        headline1link = results[0].url;
        console.log(headline1link);
        document.getElementById("article1").innerHTML = results[0].title;
        document.getElementById("article2").innerHTML = results[1].title;
        document.getElementById("article3").innerHTML = results[2].title;
        document.getElementById("article4").innerHTML = results[3].title;
        document.getElementById("article5").innerHTML = results[4].title;
        document.getElementById("article6").innerHTML = results[5].title;
      })
//Weather API Key: Your API Key: e324ec4975e24b42a5dc26acf9346d20


var url = 'http://api.weatherbit.io/v2.0/current';
let paramets = {
  city:"cardiff",
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
        var results = data;
        console.log(wind_speed);
        console.log(wind_dir);
        console.log(results);
        document.getElementById("temp").innerHTML = "Temperature: " + temp + " Celsius";
        document.getElementById("description").innerHTML = "Description: " + description;
        document.getElementById("rain").innerHTML = "Precipitation: " + precip + " mm";
        document.getElementById("wind_speed").innerHTML = "Wind Speed: " + wind_speed + " m/s";
        document.getElementById("wind_dir").innerHTML = "Wind Direction: " + wind_dir;
        document.getElementById("sunrise").innerHTML = "Wind Speed: " + sunrise;
        document.getElementById("sunset").innerHTML = "Wind Direction: " + sunset;
      })
