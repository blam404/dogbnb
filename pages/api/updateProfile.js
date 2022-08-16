import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
	try {
		const client = await clientPromise;
		const db = await client.db("dogbnb");

		const { firstName, lastName, userId, username } = req.body;

		const filter = {
			_id: ObjectId(userId),
		};
		const updateItem = {
			$set: {
				firstName: firstName,
				lastName: lastName,
				username: username,
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
