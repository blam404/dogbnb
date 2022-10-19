import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import clientPromise from "../lib/mongodb";
import { Context } from "../components/store";
import Footer from "../components/footer";
import Header from "../components/header";
import Review from "../components/review";
import titleCase from "../utils/titleCase";

import { HiPencil } from "react-icons/hi";

export async function getServerSideProps(context) {
	try {
		const client = await clientPromise;
		const db = await client.db("dogbnb");
		const dog = await db.collection("dogs").find({}).toArray();
		const reservations = await db
			.collection("reservations")
			.find({})
			.toArray();
		const convertedDogs = JSON.parse(JSON.stringify(dog));
		const convertedReservations = JSON.parse(JSON.stringify(reservations));

		return {
			props: {
				dogs: convertedDogs,
				reservations: convertedReservations,
			},
		};
	} catch (e) {
		console.error(e);
		return {
			props: { dogs: [], reviews: [] },
		};
	}
}

export default function Reservations({ dogs, reservations }) {
	const [dogId, setDogId] = useState();
	const [futureRes, setFutureRes] = useState();
	const { loading, user } = useContext(Context);
	const [pastRes, setPastRes] = useState();
	const [rating, setRating] = useState(0);
	const [reservationId, setReservationId] = useState();
	const [review, setReview] = useState("");

	const reviewRef = useRef();

	const route = useRouter();

	useEffect(() => {
		if (!user && !loading) {
			route.push("/");
		}
	}, [user]);

	const openReviewModal = (resId, doggyId) => {
		setRating(0);
		setReview("");
		setDogId(doggyId);
		setReservationId(resId);
		reviewRef.current.openModal();
	};

	useEffect(() => {
		if (user) {
			const today = new Date().getTime();
			const userReservations = reservations.filter(
				(res) => res.email === user.email
			);
			const future = userReservations.filter(
				(res) => res.endDate > today
			);
			const past = userReservations.filter((res) => res.endDate < today);
			future.sort(sortOldest);
			past.sort(sortNewest);
			setFutureRes(future);
			setPastRes(past);
		}
	}, [user]);

	const sortNewest = (a, b) => {
		if (a.startDate < b.startDate) {
			return 1;
		}
		if (a.startDate > b.startDate) {
			return -1;
		}
		return 0;
	};

	const sortOldest = (a, b) => {
		if (a.startDate < b.startDate) {
			return -1;
		}
		if (a.startDate > b.startDate) {
			return 1;
		}
		return 0;
	};

	const mapRes = (resList, past) => {
		return (
			<>
				<div className="flex flex-wrap justify-start">
					{resList.map((res) => {
						const currentDog = dogs.find(
							(dog) => dog._id === res.dogId
						);

						return (
							<div
								className="flex items-center justify-between w-full md:w-1/3 mb-4"
								key={`reservation-${res._id}`}
							>
								<div className="flex items-center">
									<div className="w-14 h-14 mr-2 relative">
										<Link href={`/dogs/${currentDog._id}`}>
											<Image
												src={currentDog.pics[0]}
												layout="fill"
												objectFit="cover"
												className="rounded-lg cursor-pointer"
											/>
										</Link>
									</div>

									<div>
										<p className="m-0 leading-4">
											{titleCase(currentDog.name)}
										</p>
										<p className="text-slate-400 m-0 leading-4">
											{new Date(
												res.startDate
											).toLocaleDateString("en-US")}{" "}
											&ndash;{" "}
											{new Date(
												res.endDate
											).toLocaleDateString("en-US")}
										</p>
									</div>
								</div>
								{past && !res.reviewed && (
									<div>
										<HiPencil
											className="w-5 h-4 mx-2 cursor-pointer"
											onClick={() =>
												openReviewModal(
													res._id,
													currentDog._id
												)
											}
										/>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</>
		);
	};
	if (user) {
		return (
			<>
				<Header position="fixed" />
				{user ? (
					<>
						<div className="flex justify-center mt-24">
							<div className="container px-4">
								<h1 className="mb-2">Doggy Play Dates</h1>
								{futureRes && futureRes.length > 0 && (
									<>
										<hr className="my-6" />
										<h2 className="mb-4">
											Future Play Dates
										</h2>
										{mapRes(futureRes)}
									</>
								)}
								{pastRes && pastRes.length > 0 && (
									<>
										<hr className="my-6" />
										<h2 className="mb-4">
											Past Play Dates
										</h2>
										{mapRes(pastRes, true)}
									</>
								)}
								{!futureRes && !pastRes && (
									<>
										<hr className="my-6" />
										<p>
											You have not scheduled any play
											dates with the doggos.
										</p>
									</>
								)}
								<Review
									ref={reviewRef}
									rating={rating}
									setRating={setRating}
									review={review}
									setReview={setReview}
									dogId={dogId}
									reservationId={reservationId}
								/>
							</div>
						</div>
					</>
				) : (
					<></>
				)}
				<Footer position="fixed" />
			</>
		);
	}
}
