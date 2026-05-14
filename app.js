const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
 

//mongoose setup
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
   .then(() => {
    console.log("Connected to DB");
   })
   .catch((err) => {
    console.log(err);
   });

async function main() {
    await mongoose.connect(MONGO_URL);
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//Home Route
app.get("/", (req, res) => {
    res.render("listings/home");
});


// Index Route
app.get("/listings", async (req, res) =>  {
    const allListings = await Listing.find({}).sort({ _id: -1 });
    res.render("listings/index", {allListings});
});


//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new")
});



//Show Route
app.get("/listings/:id", async (req, res)  =>  {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", {listing});
});


//Create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})


//Edit route
app.get("/listings/:id/edit", async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", {listing}); 
}); 


//Update Route
app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
})


//Delete Route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
})

//Server Setup
app.listen(8080, ()  => {
    console.log("Server is Running on port 8080");
});




/* //Listing Route
app.get("/testListing", async (req, res)  =>  {
    let sampleListing = new Listing({
        title: "My New House",
        description: "By the Beach",
        price: 1200,
        location: "Mars",
        country: "India",
    });
    await sampleListing.save();
    console.log("Sample Saved Successfully");
    res.send("Successfull Testing")
}); */