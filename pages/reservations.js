import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";

import clientPromise from "../lib/mongodb";
import { Context } from "../components/store";
import Footer from "../components/footer";
import Header from "../components/header";
import titleCase from "../utilityFunctions/titleCase";

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
	const [futureRes, setFutureRes] = useState();
	const { login } = useContext(Context);
	const [pastRes, setPastRes] = useState();

	// useEffect(() => {
	// 	if (!login.loggedIn) {
	// 		window.location.href = "/";
	// 	}
	// }, []);

	useEffect(() => {
		const today = new Date().getTime();
		const userReservations = reservations.filter(
			(res) => res.userId === login.userId
		);
		const future = userReservations.filter((res) => res.endDate > today);
		const past = userReservations.filter((res) => res.endDate < today);
		future.sort(sortOldest);
		past.sort(sortNewest);
		setFutureRes(future);
		setPastRes(past);
	}, []);

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

	const MapRes = ({ resList }) => {
		return (
			<>
				<div className="flex flex-wrap justify-start">
					{resList.map((res) => {
						const currentDog = dogs.find(
							(dog) => dog._id === res.dogId
						);

						return (
							<div
								className="flex items-center w-1/3 mb-4"
								key={`reservation-${res._id}`}
							>
								<div className="w-14 h-14 mr-2 relative">
									<Image
										src={currentDog.pics[0]}
										layout="fill"
										objectFit="cover"
										className="rounded-lg"
									/>
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
						);
					})}
				</div>
			</>
		);
	};

	return (
		<>
			{login.loggedIn ? (
				<>
					<Header position="fixed" />
					<div className="flex justify-center mt-24">
						<div className="container px-4">
							<h1 className="mb-2">Doggy Play Dates</h1>
							{futureRes && futureRes.length > 0 && (
								<>
									<hr className="my-6" />
									<h2>Future Play Dates</h2>
									<MapRes resList={futureRes} />
								</>
							)}
							{pastRes && pastRes.length > 0 && (
								<>
									<hr className="my-6" />
									<h2>Past Play Dates</h2>
									<MapRes resList={pastRes} />
								</>
							)}
							{!futureRes && !pastRes && (
								<>
									<hr className="my-6" />
									<p>
										You have not scheduled any play dates
										with the doggos.
									</p>
								</>
							)}
						</div>
					</div>
					<Footer position="fixed" />
				</>
			) : (
				<></>
			)}
		</>
	);
}
