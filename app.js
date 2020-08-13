var methodOverride  = require("method-override"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();
    
mongoose.connect('mongodb://localhost/movies', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));  
app.use(express.static('public'));
app.set("view engine","ejs");

var movieSchema = new mongoose.Schema({
    name: String,
    image: String,
    year: String,
    director: String,
    cast: String,
    storyLine: String
});
var Movie = mongoose.model("Movie", movieSchema);


// index
app.get("/", function (req,res) {
    res.redirect("/movies");
});
app.get("/movies", function (req,res) {
    Movie.find({}, function (err, movies) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {movies: movies});
        }
    });
});


// new
app.get("/movies/new", function (req,res) {
    res.render("new");
});


// create
app.post("/movies", function (req,res) {
    Movie.create(req.body.movie, function (err, createdMovie) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/movies");
        }
    });
});


// show
app.get("/movies/:id", function (req,res) {
    Movie.findById(req.params.id, function (err,shownMovie) {
        if (err) {
            res.redirect("/movies");
        } else {
            res.render("show", {movie: shownMovie});
        }
    });
});


// edit
app.get("/movies/:id/edit", function (req,res) {
    Movie.findById(req.params.id, function (err, editMovie) {
        if (err) {
            res.redirect("/movies");
        } else {
            res.render("edit", {movie: editMovie});
        }
    });
});


// update
app.put("/movies/:id", function (req,res) {
    Movie.findByIdAndUpdate(req.params.id, req.body.movie, function (err, updatedMovie) {
        if (err) {
            res.redirect("/movies");
        } else {
            res.redirect("/movies/"+req.params.id);
        }
    });
});


// delete
app.get("/movies/:id/delete",function (req,res) {
    Movie.findById(req.params.id, function (err, deletemovie) {
        if (err) {
            res.redirect("/movies/"+req.params.id);
        } else {
            res.render("delete_confirm", {movie: deletemovie});
        }
    });
});

app.delete("/movies/:id", function (req,res) {
    Movie.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/movies");
        } else {
            res.redirect("movies");
        }
    });
});


app.listen(7000, function () {console.log("SERVER")});