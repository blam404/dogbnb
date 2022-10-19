import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
	try {
		const { pageNumber, itemsPerPage } = req.body;

		const client = await clientPromise;
		const db = await client.db("dogbnb");
		const dogs = await db
			.collection("dogs")
			.find({})
			.skip((pageNumber - 1) * itemsPerPage)
			.limit(itemsPerPage)
			.toArray();

		res.status(200);
		res.json({
			dogs,
		});
	} catch (e) {
		res.status(500);
		res.json({
			dogs: [],
			error: true,
		});
	}
}
