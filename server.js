import express from "express";
const app = express();

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

const database = {
	users: [
		{
			id: "123",
			name: "John",
			email: "john@gmail.com",
			password: "cookies",
			entries: 0,
			joined: new Date(),
		},
		{
			id: "124",
			name: "Sally",
			email: "sally@gmail.com",
			password: "bananas",
			entries: 0,
			joined: new Date(),
		},
	],
};

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
	bcrypt.hash(password, saltRounds, function (err, hash) {
		console.log(hash);
		// Store hash in your password DB.
	});

	if (
		req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password
	) {
		res.json("successful signin");
	} else {
		res.status(400).json("error logging in");
	}
});
// /register -- POST res = user
app.post("/register", (req, res) => {
	const { email, name, password } = req.body;
	bcrypt.hash(password, saltRounds, function (err, hash) {
		// Store hash in your password DB.
		console.log(hash);
	});

	database.users.push({
		id: "125",
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date(),
	});
	res.json(database.users[database.users.length - 1]);
});

// /profile:userId -- GET res = user profile
app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach((user) => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	});
	if (!found) {
		res.status(400).json("user not found");
	}
});

// /image -- PUT res = updated user object or count
// NOT YET WORKING!!!
app.post("/image", (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach((user) => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!found) {
		res.status(400).json("user not found");
	}
});

app.listen(9000, () => {
	console.log("Listening on PORT 9000");
});
