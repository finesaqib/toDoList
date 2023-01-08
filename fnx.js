
exports.getDate = function ()   {
const today = new Date();
const options = {  weekday : "long",  day : "numeric",  month : "long"};
return today.toLocaleDateString("en-US", options);
};

exports.getDay = function ()   {
const today = new Date();
const options = {  weekday : "long"};
return today.toLocaleDateString("en-US", options);
};

addDefaultItems = function (){
  Item.insertMany(defaultItems, function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("Inserted");
    }
  })
}
