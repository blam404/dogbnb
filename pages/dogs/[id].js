import React from "react";
import Image from "next/image";
import { ObjectId } from "mongodb";

import { StarIcon } from "@heroicons/react/solid";

import CalendarBooking from "../../components/dogs/calendar";
import clientPromise from "../../lib/mongodb";
import Gallery from "../../components/dogs/gallery";
import Footer from "../../components/footer";
import Header from "../../components/header";
import Reservation from "../../components/dogs/reservation";
import Reviews from "../../components/dogs/reviews";
import titleCase from "../../utilityFunctions/titleCase";

export async function getStaticPaths() {
	const client = await clientPromise;
	const db = await client.db("dogbnb");
	const dogs = await db.collection("dogs").find({}).toArray();

	const paths = dogs.map((dog) => {
		return {
			params: { id: dog._id.toString() },
		};
	});
	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps(context) {
	const client = await clientPromise;
	const db = await client.db("dogbnb");
	const dogId = new ObjectId(context.params.id);

	const dog = await db.collection("dogs").find({ _id: dogId }).toArray();
	const owner = await db.collection("owners").find({}).toArray();
	const reviews = await db
		.collection("dogReviews")
		.find({ dogId: dogId })
		.sort({ reviewDate: -1 })
		.toArray();
	const convertedDogs = JSON.parse(JSON.stringify(dog));
	const convertedOwners = JSON.parse(JSON.stringify(owner));
	const convertedReviews = JSON.parse(JSON.stringify(reviews));

	return {
		props: {
			dog: convertedDogs[0],
			owners: convertedOwners,
			reviews: convertedReviews,
		},
	};
}

export default function DogPage({ dog, owners, reviews }) {
	const ratings = reviews.map((review) => {
		return review.rating;
	});
	const avgRating =
		ratings &&
		ratings.length > 0 &&
		(ratings.reduce((a, b) => a + b) / ratings.length)
			.toFixed(2)
			.replace(/[.,]00$/, "");

	const dogName = titleCase(dog.name);
	const owner = owners.find((owner) => owner._id === dog.ownerId);

	return (
		<>
			<Header position="static" />
			<div className="flex justify-center mt-8">
				<div className="container px-4">
					<h1 className="mb-2">
						{dogName} | {dog.city}, {dog.state}
						{dog.country !== "United States" && `, ${dog.country}`}
					</h1>
					<div className="flex my-2">
						<StarIcon className="w-6" />{" "}
						<strong>{avgRating}</strong> &#x2022;&nbsp;
						<span>{reviews.length} reviews</span>
					</div>
					<Gallery pictures={dog.pics} />
					<div className="flex">
						<div className="my-2 w-3/5">
							<div className="flex justify-between items-center ">
								<h2>
									{`${dogName}'s`} human is {owner.firstName}{" "}
									{owner.lastName}
								</h2>
								<div className="w-16 h-16 relative">
									<Image
										src={owner.picMedium}
										layout="fill"
										objectFit="cover"
										className="rounded-full"
									/>
								</div>
							</div>
							{dog.tricks.length > 0 && (
								<>
									<hr className="my-6 " />
									<div className="w-full">
										<h3>Cool tricks</h3>
										<div className="flex flex-wrap">
											{dog.tricks.map((trick, index) => (
												<div
													className="w-1/3"
													key={`dogTrick-${index}`}
												>
													- {trick}
												</div>
											))}
										</div>
									</div>
								</>
							)}
							{dog.diet.length > 0 && (
								<>
									<hr className="my-6 " />
									<div className="w-full">
										<h3>Dietary Restrictions</h3>
										<div className="flex flex-wrap">
											{dog.diet.map((diet, index) => (
												<div
													className="w-1/3"
													key={`diet-${index}`}
												>
													- {diet}
												</div>
											))}
										</div>
									</div>
								</>
							)}
							<hr className="my-6 " />
							<div>
								<CalendarBooking dog={dog} />
							</div>
						</div>
						<div className="relative w-2/5 pl-12">
							<Reservation dog={dog} />
						</div>
					</div>
					{reviews.length > 0 && (
						<>
							<hr className="my-6" />
							<Reviews
								reviews={reviews}
								owners={owners}
								avgRating={avgRating}
							/>
						</>
					)}
				</div>
			</div>
			<Footer position="static" />
		</>
	);
}
