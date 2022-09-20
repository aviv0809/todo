const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({
  extendet: true
}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-aviv:aviv1998@cluster0.rsswjy7.mongodb.net/todolistDB");



const todoSchema = new mongoose.Schema({
  name: String
});

const todo = mongoose.model("todo", todoSchema);

const cod = new todo({
  name: "write code"
})

const er = new todo({
  name: "get eror massege"
})

const kill = new todo({
  name: "delete everything"
})

const listSchema = new mongoose.Schema({
  name: String,
  items: [todoSchema]
});
const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  todo.find({}, function(err, found) {

    if (found.length == 0) {

      todo.insertMany([cod, er, kill], function(err) {

        if (err) {
          console.log(err);
        } else {
          console.log("good job");
        }

      });

    }


    res.render("list", {
      listTitle: "TO DO LIST",
      newI: found
    });
  });

});

app.get("/:customListName", function(req, res) {
  const customListName = req.params.customListName;
  List.findOne({
    name: customListName
  }, function(err, found) {

    if (!err) {
      if (!found) {
        const list = new List({
          name: customListName,
          items: [cod, er, kill]
        });
        list.save();
        res.render("list", {
          listTitle: customListName,
          newI: list.items
        });
      } else {
        console.log("already exsist");
        res.render("list", {
          listTitle: customListName,
          newI: found.items
        });
      }

    }

  });


});


app.post("/", function(req, res) {

  const listname = req.body.button;
  const newItem = new todo({
    name: req.body.newItem
  });

  if (listname == "TO DO LIST") {
    console.log("home");
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listname
    }, function(err, found) {

      if (!err) {
        found.items.push(newItem);
        found.save();
        res.redirect("/" + listname);
      }

    });
  }

})

app.post("/delete", function(req, res) {
  const listname = req.body.listname;
  console.log(listname);
  if (listname == "TO DO LIST") {
    todo.findByIdAndRemove(req.body.checkbox, function(err) {
      if (err) {
        console.log(err);
      }
    });

    res.redirect("/");
  } else {
    List.findOneAndUpdate({
      name: listname
    },{$pull:{items:{_id:req.body.checkbox}}}, function(err) {

      res.redirect("/"+listname);
    });
  }


});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port"+process.env.PORT);
});
