import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Context } from "../components/store";
import Footer from "../components/footer";
import Header from "../components/header";
import { validateName } from "../utils/validateName";

export default function Profile() {
	const [firstName, setFirstName] = useState("");
	const [firstNameReq, setFirstNameReq] = useState();
	const [lastName, setLastName] = useState("");
	const [lastNameReq, setLastNameReq] = useState();
	const { loading, user } = useContext(Context);
	const [profile, setProfile] = useState({});
	const [profileError, setProfileError] = useState();
	const [saveError, setSaveError] = useState();
	const [email, setEmail] = useState("");

	const route = useRouter();

	useEffect(() => {
		if (!user && !loading) {
			route.push("/");
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			getProfile();
		}
	}, [user]);

	useEffect(() => {
		updateProfile();
	}, [firstNameReq, lastNameReq]);

	const getProfile = async () => {
		if (Object.keys(profile).length === 0 && user) {
			const response = await fetch("/api/getProfile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userAuth: user }),
			});
			const data = await response.json();
			if (Object.keys(data.user).length > 0) {
				setProfile(data.user);
				setEmail(data.user.email);
				setFirstName(data.user.firstName);
				setLastName(data.user.lastName);
			} else {
				setProfileError(true);
			}
		}
	};

	const updateProfile = async () => {
		if (firstNameReq && lastNameReq) {
			const response = await fetch("/api/updateProfile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName,
					lastName,
					email,
				}),
			});
			const data = await response.json();
			if (data.acknowledged) {
				setFirstNameReq(undefined);
				setLastNameReq(undefined);
			}
			if (data.error) {
				setSaveError(true);
			}
		}
	};

	const handleFirstName = (e) => {
		setFirstName(e.target.value);
	};

	const handleLastName = (e) => {
		setLastName(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setFirstNameReq(validateName(firstName));
		setLastNameReq(validateName(lastName));
	};
	if (user) {
		return (
			<>
				{user ? (
					<>
						<Header position="fixed" />
						<div className="flex justify-center mt-24">
							<div className="container px-4">
								<h1 className="mb-2">Profile</h1>
								<hr className="my-4" />
								<div className="flex justify-center">
									<form>
										<div className="my-2">
											<p className="mb-0">
												<strong>Email</strong>: {email}
											</p>
										</div>
										<div className="my-2">
											<strong>First Name</strong>:{" "}
											<input
												type="text"
												value={firstName}
												onChange={handleFirstName}
												className="leading-4 rounded-lg"
											/>
										</div>
										<div className="my-2">
											<strong>Last Name</strong>:{" "}
											<input
												type="text"
												value={lastName}
												onChange={handleLastName}
												className="leading-4 rounded-lg"
											/>
										</div>
										<div className="flex justify-center my-2">
											<input
												type="submit"
												className="bg-slate-800 border-slate-800 text-white border-2 rounded-lg px-4 py-2 cursor-pointer"
												onClick={handleSubmit}
											/>
										</div>
									</form>
								</div>
								{profileError && (
									<div className="flex justify-center text-red-500">
										<p>
											There's a problem retrieving your
											profile information. Try again
											later.
										</p>
									</div>
								)}
								{saveError && (
									<div className="flex justify-center text-red-500">
										<p>
											There's a problem updating your
											profile information. Try again
											later.
										</p>
									</div>
								)}
								{(firstNameReq === false ||
									lastNameReq === false) && (
									<div className="flex justify-center text-red-500">
										<p>
											Your first and last name can only be
											letters.
										</p>
									</div>
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
}
