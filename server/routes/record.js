const express = require ("express");

//recordRoutes is an instance of the express router.
//Used to define routes.
//Ruter will be added as middleware and will take control of requests
const recordRoutes = express.Router();

//Database connection prereqs
const dbo = require("../db/conn")

//Convert id string to ObjectId
const ObjectId = require("mongodb").ObjectId;

//Get list of records
recordRoutes.route("/record").get(function (req, res) {
	let db_connect = dbo.getDb("employees");
	db_connect
		.collection("records")
		.find({})
		.toArray(function (err,result) {
			if (err) throw err;
			res.json(result);
		});
});

//Get sindgle record by id
recordRoutes.route("/record/:id").get(function (req,res) {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	db_connect
		.collection("records")
		.findOne(myquery, function (err, result) {
			if (err) throw err;
			res.json(result);
		});
});

//Create new record
recordRoutes.route("/record/add").post(function (req, response) {
	let db_connect = dbo.getDb();
	let myobj = {
	  name: req.body.name,
	  position: req.body.position,
	  level: req.body.level,
	};
	db_connect.collection("records").insertOne(myobj, function (err, res) {
	  if (err) throw err;
	  response.json(res);
	});
   });

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	let newvalues = {
	  $set: {
		name: req.body.name,
		position: req.body.position,
		level: req.body.level,
	  },
	};
	db_connect
	  .collection("records")
	  .updateOne(myquery, newvalues, function (err, res) {
		if (err) throw err;
		console.log("1 document updated");
		response.json(res);
	  });
   });

// Delete record
recordRoutes.route("/:id").delete((req,response) => {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	db_connect.collection("records").deleteOne(myquery, function (err, obj) {
		if (err) throw err;
		console.log("1 document deleted");
		response.json(obj);
	});
});

module.exports = recordRoutes;
