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
      console.log(parameters[key]);
      var para_string = encodeURIComponent(key) + ":" + encodeURIComponent(parameters[key]);
      para_list.push(para_string);
      console.log(para_string);
    }

 }
  return para_list;
}

var url = 'https://api.teleport.org/api/urban_areas/';
let params = {
  slug:"aarhus",
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
        document.getElementById("cityscore").innerHTML = "Quality of Life Score: " + intvalue;
        document.getElementById("housingscore").innerHTML = "Housing Score(/10): " + results[0].score_out_of_10;
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
  q:"london",
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
        document.getElementById("articles").innerHTML = "articles: " + results[0].title;
      })
//Weather API Key: Your API Key: e324ec4975e24b42a5dc26acf9346d20
var assembleKey2 = function(parameters) {
  var para_list = [];
  for (var key in parameters) {
    if (parameters.hasOwnProperty(key)) {
      var para_string = encodeURIComponent(key) + "=" + encodeURIComponent(parameters[key]);
      para_list.push(para_string);
    }

 }
  return para_list.join("&");

}

var url = 'http://api.weatherbit.io/v2.0/current';
let paramets = {
  city:"cardiff",
  key: "e324ec4975e24b42a5dc26acf9346d20"
}

var query_url = url + "?" + assembleKey2(paramets);
    console.log(query_url);




   fetch(query_url)
      .then(function(response) {
        return response.json();
      })

     .then(function(data) {
        var results = data.data[0].app_temp;
        console.log(results);
        document.getElementById("temp").innerHTML = "temp: " + results;
      })
