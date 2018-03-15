// Get Dependencies 

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const rsaValidation = require('auth0-api-jwt-rsa-validation');

// Middleware function to validate the access token when api is called.
const jwtCheck = jwt({
    secret: rsaValidation(),
    algorithms: ['RS256'],
    issuer: "https://stefanik.auth0.com/",
    audience: 'movieapi'
});

// Enable the use of the jwtCheck middleware
app.use(jwtCheck);

function GeneralPermissions(){
    let permissions = ['general'];
    for(let i = 0; i < permissions.length; i++){
        if(req.user.scope.includes(permissions[i])){
            next();
        } else {
            res.send(403, {message: 'Forbidden'});
        }
    };
}
let guard = function(req, res, next){
    // Use a case switch state on the route requested
    switch(req.path){
        // If the request is for movie reviews, check to see if the token has general scope
        case '/movies' : {
            // let permissions = ['general'];
            // for(let i = 0; i < permissions.length; i++){
            //     if(req.user.scope.includes(permissions[i])){
            //         next();
            //     } else {
            //         res.send(403, {message: 'Forbidden'});
            //     }
            // }
            // break;
            GeneralPermissions();
            break;
        }
        case '/reviews' : {
            GeneralPermissions();
            break;
        }
        case '/publications' : {
            GeneralPermissions();
            break;
        }
        case '/pending' : {
            let permissions = ['admin'];
            console.log(req.user.scope);
            for(let i = 0; i < permissions.length; i++){
                if(req.user.scope.includes(permissions[i])){
                    next();
                } else {
                    res.send(403, {message: 'Forbidden'});
                }
            }
            break;
        }
    }
}
// If we do not get the correct credentials, return appropriate message.
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            message: 'Missing or invalid token'
        });
    }
});

app.use(guard);

// Implement the movie API endpoint
app.get('/movies', function(req, res) {
    // Get the list of movies and their review scores

    let movies = [
        {title : 'Suicide Squad', release: '2016', score: 8, reviewer: 'Robert Smith', publication : 'The Daily Reviewer'},    
        {title : 'Batman vs. Superman', release : '2016', score: 6, reviewer: 'Chris Harris', publication : 'International Movie Critic'},
        {title : 'Captain America: Civil War', release: '2016', score: 9, reviewer: 'Janet Garcia', publication : 'MoviesNow'},
        {title : 'Deadpool', release: '2016', score: 9, reviewer: 'Andrew West', publication : 'MyNextReview'},
        {title : 'Avengers: Age of Ultron', release : '2015', score: 7, reviewer: 'Mindy Lee', publication: 'Movies n\' Games'},
        {title : 'Ant-Man', release: '2015', score: 8, reviewer: 'Martin Thomas', publication : 'TheOne'},
        {title : 'Guardians of the Galaxy', release : '2014', score: 10, reviewer: 'Anthony Miller', publication : 'ComicBookHero.com'},
    ];
    // Send the response as a JSON array
    res.json(movies);    
});

// Implement the reviewers API endpoint

app.get('/reviews', function(req, res){
    // Get the list of reviewers

    let authors = [
        {name : 'Robert Smith', publication : 'The Daily Reviewer', avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/angelcolberg/128.jpg'},
        {name: 'Chris Harris', publication : 'International Movie Critic', avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/bungiwan/128.jpg'},
        {name: 'Janet Garcia', publication : 'MoviesNow', avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/grrr_nl/128.jpg'},
        {name: 'Andrew West', publication : 'MyNextReview', avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/d00maz/128.jpg'},
        {name: 'Mindy Lee', publication: 'Movies n\' Games', avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/laurengray/128.jpg'},
        {name: 'Martin Thomas', publication : 'TheOne', avatar : 'https://s3.amazonaws.com/uifaces/faces/twitter/karsh/128.jpg'},
        {name: 'Anthony Miller', publication : 'ComicBookHero.com', avatar : 'https://s3.amazonaws.com/uifaces/faces/twitter/9lessons/128.jpg'}
    ];
    // Send the reviewers as a JSON array
    res.json(authors);
});

// Implement the publications API endpoint

app.get('/publications', function(req, res){
    // Get the list of publications

    let publications = [
        {name : 'The Daily Reviewer', avatar: 'glyphicon-eye-open'},
        {name : 'International Movie Critic', avatar: 'glyphicon-fire'},
        {name : 'MoviesNow', avatar: 'glyphicon-time'},
        {name : 'MyNextReview', avatar: 'glyphicon-record'},
        {name : 'Movies n\' Games', avatar: 'glyphicon-heart-empty'},
        {name : 'TheOne', avatar : 'glyphicon-globe'},
        {name : 'ComicBookHero.com', avatar : 'glyphicon-flash'}
    ];

    // Send the list of publications as a JSON array
    res.json(publications);
});

// Implement the pending reviews API endpoint

app.get('/pending', function(req, res){
    // Get list of pending reviews

    var pending = [
        {title : 'Superman: Homecoming', release: '2017', score: 10, reviewer: 'Chris Harris', publication: 'International Movie Critic'},
        {title : 'Wonder Woman', release: '2017', score: 8, reviewer: 'Martin Thomas', publication : 'TheOne'},
        {title : 'Doctor Strange', release : '2016', score: 7, reviewer: 'Anthony Miller', publication : 'ComicBookHero.com'}
    ];
    
    // Send the list of pending reviews as a JSON array
    res.json(pending);
});

// Launch API server and have it listen on port 8080.
app.listen(8080);

