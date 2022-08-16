import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
	try {
		const client = await clientPromise;
		const db = await client.db("dogbnb");
		const owners = await db.collection("owners").find({}).toArray();

		const { username } = req.body;

		const alreadyExist = owners.find(
			(owner) => owner.username === username
		);

		if (alreadyExist) {
			res.status(200);
			res.json({ user: { acknowledged: false } });
		} else {
			const result = await db.collection("owners").insertOne({
				username: username,
				firstName: "Anon",
				lastName: "Doe",
				streetNumber: "123",
				streetName: "Fake St",
				city: "Pee Pee Creek",
				state: "Ohio",
				country: "United States",
				postCode: "45690",
				email: `${username}@notreal.com`,
			});

			res.status(201);
			res.json({
				user: result,
				message: "User account has been created.",
			});
		}
	} catch (e) {
		res.status(500);
		res.json({
			user: { acknowledged: false, error: true },
		});
	}
}
