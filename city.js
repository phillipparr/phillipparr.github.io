//Show city info and hide about section
function show_content() {
    var main = document.getElementById('content');
    main.style.display = "block";
    var about = document.getElementById('about');
    about.style.display = "none";
    var footer = document.getElementById('footer');
    footer.style.display = "none";

}

//Get the list of cities from Teleport
var url = 'https://api.teleport.org/api/urban_areas/';

  fetch(url)
      .then(function(response) {
        return response.json();
      })

     .then(function(data) {
        var results = data._links["ua:item"];
        citylist(results); //call the citylist function below to access the list of cities outside this function

        var citynames = []; //make an array of the cities
        for (var i=0; i < results.length; i++) {
          citynames.push(results[i])
        }
        dropdown(citynames); //put the list of cities in the dropdown menu for choosing a city
      });

//access the list of cities, select a random city from the list, and call the APIfunctions to plug the
//random city into the parameters of those functions so each API gets data about the same city
  var citylist = function(array) {
    var randomCity = array[Math.floor(Math.random()*array.length)];//this is for the initial random city on load
    console.log(randomCity);
    teleportAPI(randomCity.href);//the list of cities returns a url which is used for this API
    newsAPI(randomCity.name);//just the name of the city is required for this API
    weatherAPI(randomCity.name);//just the name of the city is required for this API
    document.getElementById('random').addEventListener('click', function(){//this gives you a new random city when you click the random button
      var randomCity = array[Math.floor(Math.random()*array.length)];
      teleportAPI(randomCity.href);
      newsAPI(randomCity.name);
      weatherAPI(randomCity.name);
      })
  }
// Dropdown menu of all the possible cities
function dropdown(cities) {
  for (let i=0; i < cities.length; i++) {
    var menuItem = document.createElement('li');
    menuItem.appendChild(document.createTextNode(cities[i].name));
    document.getElementById("dropdown").appendChild(menuItem);
    menuItem.addEventListener('click', function(){
      teleportAPI(cities[i].href);//calling the API functions to get data when a city is chosen from the list
      newsAPI(cities[i].name);
      weatherAPI(cities[i].name);
    })
  }

}

//QOL SCORES
var assembleKey = function(parameters) { //this function encodes the proper url for the API request
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
  var query_url = city +"scores/"; //we use the variable city here, which is calling the url of a random city
      console.log(query_url);//when this fucntion is called in the citylist function above

     fetch(query_url)
        .then(function(response) {
          return response.json();
        })

       .then(function(data) {
          //The next six lines use regex to format the city description
          var str = data.summary;
          var removeBy = str.replace(/<i>[\s\S]*?<br>/gi,'');
          var removeP = removeBy.match(/(<p>[\s\S]*?<\/p>){1}/);
          var removeEmpty = removeP[0].replace(/When considering your preferences, this city does not have any category with a high rating\./gi,'');
          var removeCode = removeEmpty.replace(/\.*<br>|<b>|<p>|<\/b>|<\/p>|According to our city rankings, |Our data reflects that /gi, '')
          var final = removeCode.replace('this','This');
          var results = data.categories; //Get the scores for specific categories
          var results1 = data.teleport_city_score; //Get the overall score for a city
          var intvalue = Math.round(results1); //Round the overall score
          //Round the specific category scores
          var intscores = function(results) {
            var intscores = [];
            for (var i in results) {
              intscore = Math.round(results[i].score_out_of_10);
              intscores.push(intscore);
            }
            return intscores;
          };
          var roundedScores = intscores(results);
          //The next nine lines print the chosen scores and the city description to the page
          document.getElementById("housing").innerHTML = "Housing: " + roundedScores[0];
          document.getElementById("costOfLiving").innerHTML = "Cost Of Living: " + roundedScores[1];
          document.getElementById("safety").innerHTML = "Safety: " + roundedScores[7];
          document.getElementById("economy").innerHTML = "Economy: " + roundedScores[11];
          document.getElementById("leisureCulture").innerHTML = "Leisure & Culture: " + roundedScores[14];
          document.getElementById("healthcare").innerHTML = "Healthcare: " + roundedScores[8];
          document.getElementById("environmentalQuality").innerHTML = "Environmental Quality: " + roundedScores[10];
          document.getElementById("totalCityScore").innerHTML = "Quality of Life Score: " + intvalue;
          document.getElementById("cityDescription").innerHTML = final;
        });
}

// NEWS API Key: Your API key is: d629a7dfe79f4f86a47daf27e5a39c53
//This assembly key function differs slightly from the one above
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
  let params = {
    q:city,
    from:"2017-12-10",
    sortBy: "popularity",
    apiKey: "d629a7dfe79f4f86a47daf27e5a39c53"
  }

  var query_url = url + "?" + assembleKey1(params);
      console.log(query_url);

     fetch(query_url)
        .then(function(response) {
          return response.json();
        })

       .then(function(data) {
          var results = data.articles; //Get the top 20 articles for the city
          document.getElementById("cityName").innerHTML = city; //Print the city name to the page
          //Fill the headlines and links to the articles into the news section of the page
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
//Weatherbit API
function weatherAPI(city) {
  var url = 'http://api.weatherbit.io/v2.0/current';
  let params = {
    city:city,
    key: "e324ec4975e24b42a5dc26acf9346d20"
  }

  var query_url = url + "?" + assembleKey1(params);
      console.log(query_url);




     fetch(query_url)
        .then(function(response) {
          return response.json();
        })

       .then(function(data) {
          //The next eight lines get specific weather data
          var temp = data.data[0].app_temp;
          var description = data.data[0].weather.description;
          var windSpeed = data.data[0].wind_spd;
          var windDir = data.data[0].wind_cdir;
          var precip=data.data[0].precip;
          var sunrise = data.data[0].sunrise;
          var sunset=data.data[0].sunset;
          var dateTime=data.data[0].ob_time;
          //The next seven lines print the weather data to the page
          document.getElementById("temp").innerHTML = "Temperature: " + temp + " Celsius";
          document.getElementById("description").innerHTML = "Description: " + description;
          document.getElementById("rain").innerHTML = "Precipitation: " + precip + " mm";
          document.getElementById("windSpeed").innerHTML = "Wind Speed: " + windSpeed + " m/s " + windDir;
          document.getElementById("sunrise").innerHTML = "Sunrise: " + sunrise + " GMT";
          document.getElementById("sunset").innerHTML = "Sunset: " + sunset + " GMT";
          document.getElementById("dateTime").innerHTML = "Date & Time: " + dateTime;
        });
}
