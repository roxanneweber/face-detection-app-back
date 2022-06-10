import express from "express";
const app = express();
import knex from "knex";

// db connection
const db = knex({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "postgres",
		password: "password",
		database: "face-detect",
	},
});

db.select("*")
	.from("users")
	.then((data) => {
		// console.log(data);
	});

// bcrypt password hash
import bcrypt from "bcrypt";
const saltRounds = 10;
const password = "s0//P4$$w0rD";

// middleware
import cors from "cors";

// code needed to make __dirname and __filename work in ES modules
import * as url from "url";
// const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
//

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + "public"));

// ROUTES

// /  root -- res = 'server is working'
app.get("/", (req, res) => {
	res.send(database.users);
});

// /signin -- POST res = success/fail
app.post("/signin", (req, res) => {
	bcrypt;
	// .hash(password, saltRounds, function (err, hash) {
	// Store hash in your password DB.
	db.select("email", "hash")
		.from("login")
		.where("email", "=", req.body.email)
		.then((data) => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return db
					.select("*")
					.from("users")
					.where("email", "=", req.body.email)
					.then((user) => {
						res.json(user[0]);
					})
					.catch((err) => res.status(400).json("unable to get user"));
			} else {
				res.status(400).json("wrong credentials");
			}
		})
		// })
		.catch((err) => res.status(400).json("wrong credentials"));
});

// /register -- POST res = user
app.post("/register", (req, res) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hash(password, saltRounds, function (err, hash) {
		// Store hash in your password DB.
		db.transaction((trx) => {
			trx
				.insert({
					hash: hash,
					email: email,
				})
				.into("login")
				.returning("email")
				.then((loginEmail) => {
					return trx("users")
						.returning("*")
						.insert({
							email: loginEmail[0].email,
							name: name,
							joined: new Date(),
						})
						.then((user) => {
							res.json(user[0]);
						})
						.then(trx.commit)
						.catch(trx.rollback);
				});
		}).catch((err) => res.status(400).json("unable to register"));
	});
});

// /profile:userId -- GET res = user profile
app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	db.select("*")
		.from("users")
		.where({
			id: id,
		})
		.then((user) => {
			console.log(user);
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json("error getting user");
			}
		})
		.catch((err) => res.status(400).json("user not found"));
	// if (!found) {
	// 	res.status(400).json("user not found");
	// }
});

// /image -- PUT res = updated user object or count
// NOT YET WORKING!!!
app.post("/image", (req, res) => {
	const { id } = req.body;
	db.where("id", "=", id)
		.increment("entries", 1)
		.returning("entries")
		.then((entries) => {
			res.json(entries[0].entries);
		});
});

app.listen(9000, () => {
	console.log("Listening on PORT 9000");
});
