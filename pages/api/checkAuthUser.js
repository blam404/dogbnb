import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
	try {
		const client = await clientPromise;
		const db = await client.db("dogbnb");

		const { user } = req.body;

		const owner = await db
			.collection("owners")
			.find({ email: user.email })
			.toArray();

		if (owner.length > 0) {
			res.status(200);
			res.json({ user: { acknowledged: true } });
		} else {
			const result = await db.collection("owners").insertOne({
				firstName: "Anon",
				lastName: "Doe",
				streetNumber: "123",
				streetName: "Fake St",
				city: "Pee Pee Creek",
				state: "Ohio",
				country: "United States",
				postCode: "45690",
				email: user.email,
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
