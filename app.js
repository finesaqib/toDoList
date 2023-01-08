const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

// mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://aeiro:test-123@cluster0.extpm9a.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name : String
};

const listSchema = {
  name: String,
  Items: [itemsSchema]
}
let port = process.env.PORT;
if (port == null  || port == "") {
  post = 3000
}
const Item = mongoose.model( "Item", itemsSchema);

const List = mongoose.model("List", listSchema);

const Item1 = {
  name: "To Do 1"
};

const Item2 = {
  name: "To Do 2"
};
const Item3 = {
  name: "To Do 3"
};
var defaultItems = [Item1,Item2,Item3];

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
//This Code will enable using the files within the public folder to list.ejs
app.use(express.static("public"));

//Get fnx at root
app.get("/",function(req,res){
  console.log("Checking For DB");

  Item.find({},function(err,foundItems){
    console.log("Err: " + err);
    if (foundItems.length === 0 ) {
      console.log("Found No Items");
      console.log("Found Items");
      Item.insertMany(defaultItems, function(err){
        if (!err){
          console.log("No Error in Inserting");
        }
      })
      res.redirect("/");
    } else {
      console.log("Found Items");
      console.log(foundItems);
      res.render("list", {head: "Today", thisitem : foundItems});
    }
  })
});
//
app.get("/:customName",function(req,res){

const gotParam = _.capitalize(req.params.customName);
console.log("Param: " + gotParam);

List.findOne({name: gotParam},function(err,foundItems){
  if (err) {
    console.log("Err : " + err);
  } else {
    console.log("Entering Else - No Error");
    console.log("Found Items: " + foundItems);
    if(!foundItems){
      console.log("No Items Found. Adding ..");
      const listd = new List ( {
        name : gotParam,
        Items: defaultItems
      })
console.log("Object Created");
      listd.save();
      console.log("Saved");
      res.redirect("/" + gotParam)
      // res.render("list", {head: gotParam, thisitem : resp});
    } else {
      res.render("list", {head: foundItems.name, thisitem : foundItems.Items});
    }}
})

});

app.post("/",function(req,res){
  // const gotItem = req.body.listitem;
  const itemName = req.body.listitem;
  console.log(itemName);
  const gotItem = new Item ({
    name: itemName
  });
  console.log(gotItem);

  const listName = _.capitalize(req.body.Submit);
console.log(listName);
  if (listName === "Today") {
    console.log("This is Today");
    gotItem.save();
    res.redirect("/");
  } else {
    console.log("Not Today");
    List.findOne({name: listName }, function(err, foundList) {
      console.log(foundList);
      foundList.Items.push(gotItem);
      foundList.save();
      console.log(gotItem + "Pushed");
      res.redirect("/" + listName);
    })

  }

})

app.post("/delete",function(req,res){
  // const gotItem = req.body.listitem;
let cbItem = req.body.cb
const listName = _.capitalize(req.body.Submit);
console.log("ID:" + cbItem);
console.log("ListName: " + listName);
if (listName === "Today"){
  console.log("Today List");
  Item.findByIdAndRemove(cbItem,function(err){
    console.log(err);
  })
  res.redirect("/");
} else {
  console.log("Not Today List " + listName);
  List.findOneAndUpdate({name: listName}, {$pull:  {Items: {_id : cbItem}}}, function(err,founditem){
    console.log(founditem);
    res.redirect("/" + listName);
  })

}


})

app.listen(port, function(){
  console.log("Server is running on port 3000");
});
