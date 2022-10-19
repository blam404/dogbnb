import React, { forwardRef, useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { auth } from "../lib/firebase";
import Button from "./ui/button";
import { Context } from "../components/store";
import ModalCentered from "./ui/modalCentered";

import { FcGoogle } from "react-icons/fc";
import { HiX } from "react-icons/hi";

const AuthLogin = forwardRef((props, ref) => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [loginError, setLoginError] = useState(false);

	const closeLoginModal = () => {
		ref.current.closeModal();
	};

	const googleProvider = new GoogleAuthProvider();

	const googleLogin = async () => {
		try {
			const result = await signInWithPopup(auth, googleProvider);
			if (result.user) {
				const response = await fetch("/api/checkAuthUser", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ user: result.user }),
				});
				const data = await response.json();

				if (data.user.acknowledged) {
					setLoggedIn(true);
					window.localStorage.setItem(
						"login",
						JSON.stringify({
							loggedIn: true,
							email: data.user.email,
							displayName: result.user.displayName,
						})
					);
					setTimeout(() => {
						closeLoginModal();
						setLoggedIn(false);
					}, 300);
				} else if (data.user.error) {
					setLoginError(true);
				}
			}
		} catch (error) {
			console.log("error: ", error);
		}
	};

	return (
		<ModalCentered ref={ref}>
			<div className="flex items-center justify-between">
				<h1 className="text-base">
					<strong>Log In/Sign Up</strong>
				</h1>
				<div
					className="w-4 h-4 cursor-pointer"
					onClick={closeLoginModal}
				>
					<HiX />
				</div>
			</div>
			<hr className="my-4" />
			{!loggedIn && (
				<div>
					<p>Sign in with one of these providers:</p>
					<div className="flex flex-col items-center">
						<Button
							solid
							onClick={googleLogin}
							className="flex w-3/4 md:w-full lg:w-1/2 gap-4 justify-center"
						>
							<FcGoogle className="h-6 w-6" />
							Sign in with Google
						</Button>
					</div>
				</div>
			)}
			{loggedIn && (
				<div>
					<p>Logged in.</p>
				</div>
			)}
			{loginError && (
				<div>
					<p>Error logging in. Try again or contact an admin.</p>
				</div>
			)}
		</ModalCentered>
	);
});

export default AuthLogin;
