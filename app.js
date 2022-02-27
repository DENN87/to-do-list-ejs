const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
	useNewUrlParser: true,
});

const itemsSchema = { name: String };
const Item = mongoose.model("Item", itemsSchema);

// default items to populate the list when empty
const item1 = new Item({ name: "Welcome to your daily list !" });
const item2 = new Item({ name: "Use + to add to the list" });
const item3 = new Item({ name: "<--check as marked on the list" });

const defaultItems = [item1, item2, item3];

const listSchema = { name: String, items: [itemsSchema] };
const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
	Item.find({}, (err, foundItems) => {
		if (foundItems.length === 0) {
			Item.insertMany(defaultItems, (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log("Successfully saved default items to DB.");
				}
			});
			res.redirect("/");
		} else {
			res.render("list", {
				listTitle: "Today",
				newListItems: foundItems,
			});
		}
	});
});

app.get("/:customListName", (req, res) => {
	// creating new list by typing .../NEW_LIST_NAME
	const customListName = _.capitalize(req.params.customListName);
	// looking for the NEW_LIST_NAME in existing LIST database if not found creating a new one with the name /NEW_LIST_NAME
	List.findOne({ name: customListName }, (err, foundList) => {
		if (!err) {
			if (!foundList) {
				// list not found, create a new list
				const list = new List({
					name: customListName,
					items: defaultItems,
				});
				list.save();
				res.redirect("/" + customListName);
			} else {
				// list found, render existing list
				res.render("list", {
					listTitle: foundList.name,
					newListItems: foundList.items,
				});
			}
		}
	});
});

app.post("/", (req, res) => {
	const itemName = req.body.newItem;
	const listName = req.body.list;

	const item = new Item({
		name: itemName,
	});
	if (listName === "Today") {
		// adding to current list
		item.save();
		res.redirect("/"); // redirecting to home
	} else {
		// in this case if its a different list then adding to item to the correct list, finding the coresponding lsit
		List.findOne({ name: listName }, (err, foundList) => {
			foundList.items.push(item);
			foundList.save();
			res.redirect("/" + listName);
		});
	}
});

app.post("/delete", (req, res) => {
	const checkedItemID = req.body.checkbox;
	const listName = req.body.listName;

	if (listName === "Today") {
		Item.findByIdAndRemove(checkedItemID, (err) => {
			if (!err) {
				console.log("Successfully deleted checked item.");
				res.redirect("/");
			}
		});
	} else {
		List.findOneAndUpdate(
			{ name: listName },
			{
				$pull: {
					// this operator removes from an existing array all instances of a value or values that match a specified condition.
					items: { _id: checkedItemID },
				},
			},
			(err, foundList) => {
				if (!err) {
					res.redirect("/" + listName);
				}
			}
		);
	}
});

app.listen(process.env.PORT || 3000, () => {
	console.log("Server running on 3000.");
});
