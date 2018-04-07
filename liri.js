require("dotenv").config();
var inquirer=require("inquirer")
var keys=require("./keys.js")
var Spotify = require('node-spotify-api');
var Twitter = require('twitter'); 
var fs = require("fs");
var request= require("request")

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);




  inquirer.prompt([
    {
        type: "list",
        message: "What do you want to do?",
        choices: ["my-tweets","spotify-this-song","movie-this","do-what-it-says"],
        name: "choice"
    },
 
  ]). then(function(response){
  
    if (response.choice==="spotify-this-song"){

inquirer.prompt([
  {type:"input",
message:"What song do you want to search?",
name:"song"}
]).then (function(response2){


  fun_spotify(response2.song)


})
    
    }

    if (response.choice==="my-tweets"){
     fun_tweeter() 
    }


  if (response.choice==="movie-this"){


    inquirer.prompt([
      {type:"input",
    message:"What movie do you want to search?",
    name:"movie"}
    ]).then (function(response2){
      fun_movies(response2.movie)
    })
      
    
    }


if (response.choice==="do-what-it-says"){

  fs.readFile("random.txt", "utf8", function(error, data) {
    var to_do=data.split(",")
    var menu=to_do[0]
    var value=to_do[1]
    
    if (menu==="spotify-this-song"){
      fun_spotify(value)   
    }

    if (menu==="my-tweets"){
     fun_tweeter() 
    }
    
    if (menu==="movie-this"){
      fun_movies(value)
    }
})

}

})



function fun_spotify(song){

  spotify.search({ type: 'track', query: song, limit:1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err)
    }
  //console.log(JSON.stringify( data, null ,2)); 
  console.log('Song:'+ data.tracks.items[0].name)
  for(i=0;i<data.tracks.items[0].artists.length;i++)
  {
  console.log('Artist'+i+1+':'+data.tracks.items[0].artists[i].name)
  }
  console.log('Preview:'+data.tracks.items[0].preview_url)
  })

spotify.search({ type: 'album', query: song, limit:1 }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err)
  }  
console.log('Album:'+data.albums.items[0].name)
})
}


function fun_tweeter(){
  client.get("statuses/user_timeline", function(error, tweets, response) {
       
    for (i=0;i<tweets.length;i++){
     console.log(tweets[i].created_at);
     console.log(tweets[i].text);}
   })
}

function fun_movies(movie){

  request('http://www.omdbapi.com/?apikey=trilogy&t='+ movie , function (error, response, body) {
    console.log('Title:', JSON.parse(body).Title);
    console.log('Year:', JSON.parse(body).Year);
    console.log('Rating:', JSON.parse(body).Rated);
  
    for(i=0;i<JSON.parse(body).Ratings.length;i++){
    if(JSON.parse(body).Ratings[i].Source==="Rotten Tomatoes"){
    console.log(JSON.parse(body).Ratings[i].Source +":" + JSON.parse(body).Ratings[i].Value)
    } }
    console.log('Country:', JSON.parse(body).Country);
    console.log('Language:', JSON.parse(body).Language);
    console.log('Actors:', JSON.parse(body).Actors);
    console.log('Plot:', JSON.parse(body).Plot);
  })

}