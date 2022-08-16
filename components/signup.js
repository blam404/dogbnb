import React, { forwardRef, useContext, useEffect, useState } from "react";

import { Context } from "../components/store";
import ModalCentered from "./ui/modalCentered";

import { XIcon } from "@heroicons/react/solid";

const SignUp = forwardRef((props, ref) => {
	const [accountCreated, setAccountCreated] = useState(false);
	const [charReq, setCharReq] = useState(false);
	const { login, setLogin } = useContext(Context);
	const [maxReq, setMaxReq] = useState(false);
	const [minReq, setMinReq] = useState(false);
	const [needUsername, setNeedUsername] = useState(false);
	const [password, setPassword] = useState("");
	const [userCreateError, setUserCreateError] = useState(false);
	const [userExists, setUserExists] = useState(false);
	const [username, setUsername] = useState("");

	const closeModal = () => {
		ref.current.closeModal();
	};

	const checkUsername = (username) => {
		setUserExists(false);
		setUserCreateError(false);
		username.length >= 4 ? setMinReq(true) : setMinReq(false);
		username.length < 12 ? setMaxReq(true) : setMaxReq(false);
		username.match(/^[A-Za-z0-9]*$/g)
			? setCharReq(true)
			: setCharReq(false);
	};

	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password) {
			console.log(
				"01011001 01101111 01110101 00100000 01100001 01110010 01100101 00100000 01100001 00100000 01110010 01101111 01100010 01101111 01110100 00100001"
			);
			return;
		}
		if (!username) {
			setNeedUsername(true);
			setMinReq(false);
			setMaxReq(false);
			setCharReq(false);
			return;
		} else {
			if (needUsername) {
				setNeedUsername(false);
			}
			checkUsername(username);
		}
	};

	useEffect(() => {
		signUpFunction();
	}, [minReq, maxReq, charReq]);

	const signUpFunction = async () => {
		if (minReq && maxReq && charReq) {
			const response = await fetch("/api/createUser", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username: username }),
			});
			const data = await response.json();
			if (data.user.acknowledged) {
				setAccountCreated(true);
				setLogin({ loggedIn: true, username: username });
				window.localStorage.setItem(
					"login",
					JSON.stringify({ loggedIn: true, username: username })
				);

				setTimeout(() => {
					closeModal();
					setAccountCreated(false);
					setMinReq(false);
					setMaxReq(false);
					setCharReq(false);
					setUsername("");
					setUserExists(false);
					setUserCreateError(false);
				}, 1500);
			} else if (!data.user.acknowledged) {
				if (data.user.error) {
					setUserCreateError(true);

					return;
				}
				setUserExists(true);
			}
		}
	};

	return (
		<ModalCentered ref={ref}>
			<div className="flex items-center justify-between">
				<h1 className="text-base">
					<strong>Sign Up</strong>
				</h1>
				<div className="w-4 h-4 cursor-pointer" onClick={closeModal}>
					<XIcon />
				</div>
			</div>
			<hr className="my-4" />
			{!accountCreated && (
				<>
					<div>
						<p>
							The scope of this project doesn't require a real
							functioning authentication page. Enter a unique
							username that you don't use elsewhere and that'll be
							your login.
						</p>
						<p>
							<strong>Requirements</strong>:
						</p>
						<ul>
							<li style={{ color: minReq ? "" : "red" }}>
								Minimum 4 characters
							</li>
							<li style={{ color: maxReq ? "" : "red" }}>
								Maximum 12 characters
							</li>
							<li style={{ color: charReq ? "" : "red" }}>
								Only letters and numbers
							</li>
						</ul>
					</div>
					<hr className="my-4" />
					<div>
						<form>
							<div className="mb-2">
								<strong>Username</strong>:{" "}
								<input
									type="text"
									value={username}
									onChange={handleUsernameChange}
									className="leading-4 rounded-lg"
								/>
								{needUsername && (
									<span style={{ color: "red" }}>
										{" "}
										Pick a username.
									</span>
								)}
								{userExists && (
									<span style={{ color: "red" }}>
										{" "}
										That username is already taken.
									</span>
								)}
								{userCreateError && (
									<span style={{ color: "red" }}>
										{" "}
										Error creating user. Try again or
										contact an admin.
									</span>
								)}
							</div>
							<div className="mb-2 hidden">
								<strong>Password</strong>:{" "}
								<input
									type="text"
									value={password}
									onChange={handlePasswordChange}
									className="leading-4 rounded-lg"
								/>
							</div>
							<div className="flex justify-center">
								<input
									type="submit"
									className="bg-slate-800 border-slate-800 text-white border-2 rounded-lg px-4 py-2 cursor-pointer"
									onClick={handleSubmit}
								/>
							</div>
						</form>
					</div>
				</>
			)}
			{accountCreated && (
				<>
					<div>
						<p>Your account has been created and are logged in.</p>
					</div>
				</>
			)}
		</ModalCentered>
	);
});

export default SignUp;
