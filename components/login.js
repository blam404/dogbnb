import React, { forwardRef, useContext, useState } from "react";

import { Context } from "../components/store";
import ModalCentered from "./ui/modalCentered";

import { XIcon } from "@heroicons/react/solid";

const LogIn = forwardRef(({ signUpModalRef }, ref) => {
	const { login, setLogin } = useContext(Context);
	const [loginError, setLoginError] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);
	const [needUsername, setNeedUsername] = useState(false);
	const [username, setUsername] = useState("");

	const closeLoginModal = () => {
		ref.current.closeModal();
	};

	const openSignUpModalRef = () => {
		closeLoginModal();
		signUpModalRef.current.openModal();
	};

	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!username) {
			setNeedUsername(true);
		} else {
			if (needUsername) {
				setNeedUsername(false);
			}
			const response = await fetch("/api/signIn", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username: username }),
			});
			const data = await response.json();

			if (data.user.acknowledged) {
				setLoggedIn(true);
				setLogin({
					loggedIn: true,
					username: data.user.username,
					userId: data.user.userId,
				});
				window.localStorage.setItem(
					"login",
					JSON.stringify({
						loggedIn: true,
						username: data.user.username,
						userId: data.user.userId,
					})
				);

				setTimeout(() => {
					closeLoginModal();
					setLoggedIn(false);
					setUsername("");
				}, 1500);
				// add in else if acknowledge === false and error === false
				// then set error to let user name doesn't exist
			} else if (!data.user.error) {
				setLoginError(true);
			}
		}
	};

	return (
		<ModalCentered ref={ref}>
			<div className="flex items-center justify-between">
				<h1 className="text-base">
					<strong>Log In</strong>
				</h1>
				<div
					className="w-4 h-4 cursor-pointer"
					onClick={closeLoginModal}
				>
					<XIcon />
				</div>
			</div>
			<hr className="my-4" />
			{!loggedIn && (
				<>
					<div>
						<p>
							The scope of this project doesn't require a real
							functioning authentication page. If you previously
							created an account, enter your username and you'll
							be logged in. Otherwise,{" "}
							<span
								className="cursor-pointer text-slate-400"
								onClick={openSignUpModalRef}
							>
								sign up
							</span>
						</p>
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
										Enter your username.
									</span>
								)}
								{loginError && (
									<span style={{ color: "red" }}>
										{" "}
										Error logging in. Try again or contact
										an admin.
									</span>
								)}
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
			{loggedIn && (
				<div>
					<p>Logged in.</p>
				</div>
			)}
		</ModalCentered>
	);
});

export default LogIn;
