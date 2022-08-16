import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
	try {
		const client = await clientPromise;
		const db = await client.db("dogbnb");

		const { login } = req.body;

		const user = await db
			.collection("owners")
			.find({ _id: ObjectId(login.userId) })
			.toArray();

		res.status(200);
		res.json({
			user: user[0],
		});
	} catch (e) {
		res.status(500);
		res.json({
			user: {},
		});
	}
}
