
function database() {
  console.log("oleeeeeee");

  var dat = new XMLHttpRequest();
  // Setup our listener to process completed requests
  dat.onreadystatechange = function () {
    // Only run if the request is complete
    if (dat.readyState !== 4) return;
    // Process our return data
    if (dat.status >= 200 && dat.status < 300) {
      const t = JSON.parse(dat.responseText);
      let num = t["address"].length;
      let count=1;
      console.log(num);
      let i=0;
      for ( i = num-1; i >= 0; i--) {
      
        document.getElementById("add" + (count)).textContent = t["address"][i];
        document.getElementById("reg" + (count)).textContent = t["region"][i];
        document.getElementById("c" + (count)).textContent = t["city"][i];
        let dt = t["timestamp"][i];

        dt = new Date(dt * 1000);
        let dt_hours = dt.getHours();
        let dt_minutes = dt.getMinutes();
        if (dt_minutes < 10) {
          dt_minutes = "0" + dt_minutes.toString();
        }
        if (dt_hours < 10) {
          dt_hours = "0" + dt_hours.toString();
        }
        document.getElementById("t" + (count)).textContent = dt_hours + ":" + dt_minutes;
        if(count===5){
          break;
        }
        count++;
      }
      
    } else {
      console.log('error', dat);
    }
  };

  dat.open('GET', 'ole.php');
  dat.send();

}


var map = new ol.Map({ // a map object is created
  target: 'map', // the id of the div in html to contain the map
  layers: [ // list of layers available in the map
    new ol.layer.Tile({ // first and only layer is the OpenStreetMap tiled layer
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({ // view allows to specify center, resolution, rotation of the map
    center: ol.proj.fromLonLat([33.4079103, 35.1463009]), // center of the map
    zoom: 5 // zoom level (0 = zoomed out)
  })
});
layer_temp = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=014f5dec2684d69d32d6e800b84adc65',

  })
});
map.addLayer(layer_temp); // a temp layer on map
layer_temp2 = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=014f5dec2684d69d32d6e800b84adc65',
  })

});





function view(icon, dt, pressure, humidity, main, speed, name, cdis, cpre, ctemp) {
  const t=["JAN","FEB","MAR","APR","MAY","JUNE","JUL","AUG","SEP","OCT","NOV","DEC"]

  let hours = dt.getHours();
          let minutes = dt.getMinutes();
          if (hours < 10) {
            hours = "0" + hours

          }
          if (minutes < 10) {
            minutes = "0" + minutes;
          }
  document.getElementById("exampleModalLabel").textContent = "Weather in " + name + " on " + dt.getDate() + " " + t[dt.getMonth()-1] + " " + (dt.getYear() - 100 + 2000) + " " + hours +":"+ minutes;
  let src = "https://openweathermap.org/img/w/" + icon + ".png";
  document.getElementById("lefticon").src = src;
  document.getElementById("humidity2").textContent = humidity + "%";
  document.getElementById("pressure2").textContent = pressure + " " + cpre;
  document.getElementById("main2").textContent = main;
  document.getElementById("speed2").textContent = speed + " " + cdis;


}



function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
  map.updateSize();
}

function insertVasi() {
  var reqvasi = new XMLHttpRequest();
  reqvasi.onreadystatechange = function () {
    if (reqvasi.readyState !== 4) return;
    if (reqvasi.status >= 200 && reqvasi.status < 300) {
     
    } else {
      console.log('error', reqvasi);
    }
  };
  reqvasi.open('POST', 'ole2.php');
  reqvasi.setRequestHeader("Content-Type", "application/json");
  const d = {};
  d.address = document.querySelector("#InputAddress").value;
  d.region = document.querySelector("#InputRegion").value;
  d.city = document.querySelector("#town").value;
  reqvasi.send(JSON.stringify(d));
}

const form = document.querySelector('form');
form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  const address = document.querySelector('#InputAddress');
  address.value = address.value.trim();
  const region = document.querySelector("#InputRegion");
  region.value = region.value.trim();
  const town = document.querySelector("#town");
  var temperature = "";
  var ctemp = "";
  var cdis = "";
  var cpre = "";
  if (document.getElementById("flexRadioDefault1").checked) {
    temperature = "metric";
    ctemp = "C";
    cdis = "m/sec"
    cpre = "hPa"
  } else {
    temperature = "imperial";
    ctemp = "F";
    cdis = "miles/hour";
    cpre = "Mb";
  }
  let elements = document.getElementsByClassName("hide");
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = 'none';
  }

  if (address.value.length == 0 || region.value.length == 0 || town.value === "Select city") {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = 'block';
    }
    return;
  }

  var weather;
  var coord;
  var lat;
  var lon;
  var xhr = new XMLHttpRequest();
  // Setup our listener to process completed requests
  xhr.onreadystatechange = function () {
    // Only run if the request is complete
    if (xhr.readyState !== 4) return;
    // Process our return data

    if (xhr.status >= 200 && xhr.status < 300) {
      coord = JSON.parse(xhr.responseText);
      if (coord.length === 0) {
        alert("CAN NOT FIND THAT LOCATION");
        return;
      } else {
       
        const visible = document.querySelector('.visible').style.display = "block";
        map.updateSize();
        insertVasi();
      }
      lat = coord[0]["lat"];
      lon = coord[0]["lon"]
      var req = new XMLHttpRequest();
      // Setup our listener to process completed requests
      req.onreadystatechange = function () {
        // Only run if the request is complete
        if (req.readyState !== 4) return;
        // Process our return data
        if (req.status >= 200 && req.status < 300) {
          // What to do when the request is successful
          
          weather = JSON.parse(req.responseText);
          let description = weather.weather[0].description;
          let icon = weather.weather[0].icon;
          let temp = weather.main.temp;
          let pressure = weather.main.pressure;
          let humidity = weather.main.humidity;
          let temp_min = weather.main.temp_min;
          let temp_max = weather.main.temp_max;
          let clouds = weather.clouds.all;
          let speed = weather.wind.speed;
          let country = weather.sys.country;
          let sunrise = weather.sys.sunrise;

          let sunset = weather.sys.sunset;
          sunset = new Date(sunset * 1000);
          sunrise = new Date(sunrise * 1000);

          let sunrise_hours = sunrise.getHours();
          let sunrise_minutes = sunrise.getMinutes();
          if (sunrise_hours < 10) {
            sunrise_hours = "0" + sunrise_hours

          }
          if (sunrise_minutes < 10) {
            sunrise_minutes = "0" + sunrise_minutes;
          }

          let sunset_hours = sunset.getHours();
          let sunset_minutes = sunrise.getMinutes();
          if (sunset_hours < 10) {
            sunset_hours = "0" + sunset_hours.toString();

          }
          if (sunset_minutes < 10) {
            sunset_minutes = "0" + sunset_minutes.toString();
          }
          document.getElementById("pressure").textContent = pressure + " " + cpre;
          document.getElementById("Humidity").textContent = humidity + "%";
          document.getElementById("speed").textContent = speed + " " + cdis;
          document.getElementById("clouds").textContent = clouds + "%";
          document.getElementById("sunset").textContent = sunset_hours + ":" + sunset_minutes;
          document.getElementById("sunrise").textContent = sunrise_hours + ":" + sunrise_minutes;

          // document.getElementById("icon").textContent = icon;
          document.getElementById("low").innerHTML = temp_min + "<sup>o</sup>" + ctemp;
          document.getElementById("high").innerHTML = temp_max + "<sup>o</sup>" + ctemp;
          document.getElementById("currentT").innerHTML = temp + "<sup>o</sup>" + ctemp;
          document.getElementById("description").textContent = description;
          let src = "https://openweathermap.org/img/w/" + icon + ".png";
          document.getElementById("icon").src = src;



        } else {
          // What to do when the request has failed
          console.log('error', req);
        }
      };
      let url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=" + temperature + "&APPID=014f5dec2684d69d32d6e800b84adc65";
      req.open('GET', url);
      req.send();


      var req2 = new XMLHttpRequest();
      // Setup our listener to process completed requests
      req2.onreadystatechange = function () {
        // Only run if the request is complete
        if (req2.readyState !== 4) return;
        // Process our return data
        if (req2.status >= 200 && req2.status < 300) {
          var forecast = JSON.parse(req2.responseText);
          
          var obj = [];
          for (let i = 0; i < 8; i++) {
            let dt = forecast["list"][i]["dt"];
            let pressure = forecast["list"][i]["main"]["pressure"];
            let temp = forecast["list"][i]["main"]["temp"];
            let humidity = forecast["list"][i]["main"]["humidity"];
            let main = forecast["list"][i]["weather"][0]["main"];
            let description = forecast["list"][i]["weather"][0]["description"];
            let icon = forecast["list"][i]["weather"][0]["icon"];
            let all = forecast["list"][i]["clouds"]["all"];
            let speed = forecast["list"][i]["wind"]["speed"];
            let name = forecast["city"]["name"];
            dt = new Date(dt * 1000);
            let dt_hours = dt.getHours();
            let dt_minutes = dt.getMinutes();
            if (dt_minutes < 10) {
              dt_minutes = "0" + dt_minutes.toString();
            }
            if (dt_hours < 10) {
              dt_hours = "0" + dt_hours.toString();
            }
            document.getElementById("time" + (i + 1)).textContent = dt_hours + ":" + dt_minutes;
            let src = "https://openweathermap.org/img/w/" + icon + ".png";
            document.getElementById("summary" + (i + 1)).src = src;
            // document.getElementById("summary"+(i+1)).textContent=description;
            document.getElementById("temp"+(i+1)).innerHTML = temp + "<sup>o</sup>" + ctemp;
            document.getElementById("clouds" + (i + 1)).textContent = all + "%";
            obj.push(document.getElementById("bt" + (i + 1)));
            if (obj[i]) {
              obj[i].addEventListener("click", function () { view(icon, dt, pressure, humidity, main, speed, name, cdis, cpre, ctemp); });
            }
          }

        } else {
          // What to do when the request has failed
          console.log('error', req2);
        }
      };
      let url2 = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=" + temperature + "&APPID=014f5dec2684d69d32d6e800b84adc65";
      req2.open('GET', url2);
      req2.send();

    } else {
      // What to do when the request has failed
      console.log('error', xhr);
    }
  };
  // Create and send a GET request
  // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
  // The second argument is the endpoint URL
  xhr.open('GET', 'https://nominatim.openstreetmap.org/search?q=' + address.value + ',' + region.value + ',' + town.value + '&format=json');
  xhr.send();
}

