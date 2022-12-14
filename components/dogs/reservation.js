import React, { useContext, useEffect, useRef, useState } from "react";

import Button from "../ui/button";
import { convertToUTC } from "../../utils/dateTime";
import { Context } from "../store";
import getBrowserWidth from "../../utils/getBrowserWidth";
import ModalCentered from "../ui/modalCentered";

import { HiX } from "react-icons/hi";

const Reservation = ({ dog }) => {
	const [cost, setCost] = useState();
	const {
		user,
		loginModalRef,
		startDate,
		endDate,
		setStartDate,
		setEndDate,
	} = useContext(Context);
	const [serviceFee, setServiceFee] = useState();
	const [resConfirmed, setResConfirmed] = useState();
	const [totalCost, setTotalCost] = useState();
	const [totalDays, setTotalDays] = useState();
	const { md } = getBrowserWidth();

	const reservationModalRef = useRef();

	useEffect(() => {
		if (startDate && endDate) {
			const timeDiff = endDate.getTime() - startDate.getTime();
			let dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) || 1;
			setTotalDays(dayDiff);
			setCost(dog.price * dayDiff);
			setServiceFee(Math.floor(dog.price * dayDiff * 0.12));
			setTotalCost(
				dog.price * dayDiff + Math.floor(dog.price * dayDiff * 0.12)
			);
		}
	}, [startDate, endDate]);

	const closeReservationModal = () => {
		reservationModalRef.current.closeModal();
	};

	const openReservationModal = () => {
		if (user) {
			reservationModalRef.current.openModal();
		} else {
			loginModalRef.current.openModal();
		}
	};

	const ReservationInfo = ({ onClick }) => {
		return (
			<>
				<p className="text-xl font-bold">${dog.price}/day</p>
				<div className="flex mb-4">
					<div className="w-1/2 border border-slate-400 rounded-l-lg p-3">
						<div className="text-xs text-slate-400">PICK UP</div>
						<div>
							{startDate ? (
								startDate.toLocaleDateString("en-US")
							) : (
								<p> </p>
							)}
						</div>
					</div>
					<div className="w-1/2 border border-l-0 border-slate-400 rounded-r-lg p-3">
						<div className="text-xs text-slate-400">DROP OFF</div>
						<div>
							{endDate ? (
								endDate.toLocaleDateString("en-US")
							) : (
								<p> </p>
							)}
						</div>
					</div>
				</div>
				<Button solid className="w-full my-4" onClick={onClick}>
					Reserve
				</Button>
				<div className="flex justify-between">
					<p>
						${dog.price} x {totalDays} days
					</p>
					<p>${cost}</p>
				</div>
				<div className="flex justify-between">
					<p>Service fee</p>
					<p>${serviceFee}</p>
				</div>
				<hr className="mt-2 mb-4" />
				<div className="flex justify-between font-bold">
					<p>Total before taxes</p>
					<p>${totalCost}</p>
				</div>
			</>
		);
	};

	const ReservationConfirm = () => (
		<ModalCentered ref={reservationModalRef}>
			<div className="flex items-center justify-between">
				<h1 className="text-base">
					<strong>Reservation</strong>
				</h1>
				<div
					className="w-4 h-4 cursor-pointer"
					onClick={closeReservationModal}
				>
					<HiX />
				</div>
			</div>
			<hr className="my-4" />
			{!resConfirmed && (
				<>
					<div>
						<p>
							The scope of this project doesn't require a real
							functioning payment system. Click the "Reserve"
							button and a record will be created in the system.
						</p>
					</div>
					<hr className="my-4" />
					<div className="flex justify-center w-full">
						<div className="w-full md:w-1/2">
							<ReservationInfo onClick={handleReservation} />
						</div>
					</div>
				</>
			)}
			{resConfirmed && (
				<div>
					<p>Reservation confirmed.</p>
				</div>
			)}
		</ModalCentered>
	);

	const handleReservation = async (e) => {
		e.preventDefault();
		const startUTC = convertToUTC(startDate);
		const endUTC = convertToUTC(endDate, true);
		const response = await fetch("/api/createReservation", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: user.email,
				startDate: startUTC,
				endDate: endUTC,
				dogId: dog._id,
				dogOwnerId: dog.ownerId,
				totalCost: totalCost,
			}),
		});
		const data = await response.json();
		if (data.reservation.acknowledged) {
			setResConfirmed(true);

			setTimeout(() => {
				closeReservationModal();
				setResConfirmed(false);
				setStartDate(null);
				setEndDate(null);
				location.reload();
			}, 1500);
		}
	};

	const formattedResDate = () => {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const startMonth = startDate && startDate.getUTCMonth();
		const startDay = startDate && startDate.getUTCDate();
		const endMonth = endDate && endDate.getUTCMonth();
		const endDay = endDate && endDate.getUTCDate();
		return (
			<>
				<strong>{`${months[startMonth]} ${startDay}`}</strong> &ndash;{" "}
				<strong>
					{endMonth === startMonth
						? endDay
						: `${months[endMonth]} ${endDay}`}
				</strong>
			</>
		);
	};

	if (md) {
		return (
			<div className="relative w-2/5 pl-12">
				<div className="sticky top-8 rounded-lg shadow-lg border border-slate-200 p-6 overflow-hidden">
					<ReservationInfo onClick={openReservationModal} />
				</div>
				<ReservationConfirm />
			</div>
		);
	} else if (!md) {
		return (
			<div className="fixed bottom-0 left-0 right-0 py-4 px-6 z-10 bg-slate-200">
				<div className="flex justify-between items-center">
					<div>
						<p className="mb-0">
							<span className="text-lg">
								<strong>${dog.price}</strong>
							</span>
							/day
						</p>
						<p className="mb-0">{formattedResDate()}</p>
					</div>
					<div>
						<Button solid onClick={openReservationModal}>
							Reserve
						</Button>
					</div>
				</div>
				<ReservationConfirm />
			</div>
		);
	} else {
		return null;
	}
};

export default Reservation;
