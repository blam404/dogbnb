import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
	try {
		const client = await clientPromise;
		const db = await client.db("dogbnb");

		const { firstName, lastName, email } = req.body;

		const filter = {
			email,
		};
		const updateItem = {
			$set: {
				firstName,
				lastName,
			},
		};

		const result = await db
			.collection("owners")
			.updateOne(filter, updateItem);

		res.status(200);
		res.json(result);
	} catch (e) {
		res.status(500);
		res.json({ acknowledged: false, error: true });
	}
}
