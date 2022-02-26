const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = { name: String };
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({ name: "Welcome to your daily list !" });
const item2 = new Item({ name: "Use + to add to the list" });
const item3 = new Item({ name: "<--check as marked on the list" });

const defaultItems = [item1, item2, item3];

const listSchema = { name: String, items: [itemsSchema] };
const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
    const day = "Today";

    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                console.log("Inserting defaultItems insertMany()-> succesful.");
                res.redirect("/");
            });
        } else {
            console.log("find() -> succesful, rendering...");
            res.render("list", { listTitle: day, newListItems: foundItems });
        }
    });
});

app.post("/", (req, res) => {
    let itemName = req.body.newItem;
    let listName = req.body.list;

    const item = new Item({
        name: itemName,
    });
    if (itemName != "") {
        if (listName === "Today") {
            // only adding item if input has value (user typed text)
            item.save();
            res.redirect("/");
        } else {
            List.findOne({ name: listName }, (err, foundList) => {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            });
        }
    }
});

app.post("/delete", (req, res) => {
    console.log(req.body.checkbox);
    console.log(req.body.listName);
});

app.get("/:listName", (req, res) => {
    // creating new list by typing .../NEW_LIST_NAME
    let customListName = _.capitalize(req.params.listName);
    //res.json -> sending json to display the .../NEW_LIST_NAME
    res.json(req.params.listName);
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on 3000.");
});
