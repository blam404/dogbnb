import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
	try {
		const client = await clientPromise;
		const db = await client.db("dogbnb");
		const owners = await db.collection("owners").find({}).toArray();

		const { username } = req.body;

		const userExists = owners.find((owner) => owner.username === username);

		if (userExists) {
			res.status(200);
			res.json({
				user: {
					acknowledged: true,
					username: userExists.username,
					userId: userExists._id,
				},
			});
		} else {
			res.status(200);
			res.json({ user: { acknowledged: false } });
		}
	} catch (e) {
		res.status(500);
		res.json({
			user: { acknowledged: false, error: true },
		});
	}
}
