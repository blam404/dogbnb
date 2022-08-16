import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";

import { Context } from "../store";
import { convertToUTC, xDateFromToday } from "../../utilityFunctions/dateTime";
import titleCase from "../../utilityFunctions/titleCase";

import { ChevronLeftIcon } from "@heroicons/react/solid";
import { ChevronRightIcon } from "@heroicons/react/solid";

const CalendarBooking = ({ dog }) => {
	const { endDate, setEndDate } = useContext(Context);
	const [partialSelected, setPartialSelected] = useState(null);
	const [reservations, setReservations] = useState([]);
	const { startDate, setStartDate } = useContext(Context);

	useEffect(() => {
		getReservations();
	}, []);

	const getReservations = async () => {
		if (reservations.length === 0) {
			const response = await fetch("/api/getReservations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ dog: dog }),
			});
			const data = await response.json();
			setReservations(data.reservations);
		}
	};

	useEffect(() => {
		if (reservations.length > 0) {
			let invalidStartDate = checkTileDisabled({ date: startDate });
			let invalidEndDate = checkTileDisabled({ date: endDate });
			let i = 0;
			let j = 2;
			while (invalidStartDate || invalidEndDate) {
				i++;
				j++;
				invalidStartDate = checkTileDisabled({
					date: xDateFromToday(i),
				});
				invalidEndDate = checkTileDisabled({
					date: xDateFromToday(i + 2),
				});
			}
			setStartDate(xDateFromToday(i));
			setEndDate(xDateFromToday(i + 2));
		} else {
			setStartDate(xDateFromToday(0));
			setEndDate(xDateFromToday(2, true));
		}
	}, [JSON.stringify(reservations)]);

	const handleDateSelect = (value) => {
		if (value.length === 1) {
			setPartialSelected(value[0].getTime());
		} else if (value.length === 2) {
			setStartDate(value[0]);
			setEndDate(value[1]);
			setPartialSelected(null);
		}
	};

	const checkTileDisabled = ({ date }) => {
		const dateUnix = convertToUTC(date);
		const booked = reservations.some((reservation) => {
			return (
				dateUnix >= reservation.startDate &&
				dateUnix <= reservation.endDate
			);
		});

		//logic to prevent selecting a date going through other reservation dates
		let partialBooked;
		if (partialSelected) {
			partialBooked = reservations.some((reservation) => {
				if (reservation.startDate > partialSelected) {
					return (
						dateUnix > partialSelected &&
						dateUnix > reservation.endDate
					);
				} else if (reservation.endDate < partialSelected) {
					return (
						dateUnix < partialSelected &&
						dateUnix < reservation.startDate
					);
				} else {
					return false;
				}
			});
		}
		return booked || partialBooked;
	};

	const today = new Date();
	const nextYearNumber = today.getFullYear() + 1;
	const nextYear = new Date(new Date().setFullYear(nextYearNumber));

	return (
		<>
			<h3>Hangout with {titleCase(dog.name)}</h3>
			<p className="text-slate-400">
				{startDate && endDate && (
					<>
						{`${startDate.toLocaleDateString("en-US")}`} &ndash;{" "}
						{`${endDate.toLocaleDateString("en-US")}`}
					</>
				)}
			</p>
			<Calendar
				allowPartialRange={true}
				calendarType="US"
				value={[startDate, endDate]}
				minDetail="month"
				minDate={today}
				maxDate={nextYear}
				onChange={handleDateSelect}
				nextLabel={<ChevronRightIcon className="h-4 w-4" />}
				next2Label={null}
				prevLabel={<ChevronLeftIcon className="h-4 w-4" />}
				prev2Label={null}
				selectRange={true}
				showDoubleView={true}
				tileDisabled={checkTileDisabled}
			/>
		</>
	);
};

export default CalendarBooking;
