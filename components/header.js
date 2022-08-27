import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Context } from "./store";
import DropdownWrapper from "./ui/dropdown";

import logo from "../assets/logo.png";
import { MenuIcon } from "@heroicons/react/outline";
import { UserCircleIcon } from "@heroicons/react/solid";

const Header = ({ position }) => {
	const { login, loginModalRef, setLogin, signUpModalRef } =
		useContext(Context);

	const profileMenuRef = useRef();

	const openSignupModal = () => {
		signUpModalRef.current.openModal();
	};

	const openLoginModal = () => {
		loginModalRef.current.openModal();
	};

	const openProfileMenu = () => {
		profileMenuRef.current.openMenu();
	};

	const logout = () => {
		window.localStorage.removeItem("login");
		setLogin({ loggedIn: false, username: null });
	};

	return (
		<header
			className={`${position} top-0 w-full h-16 shadow-md flex justify-center bg-white z-10`}
		>
			<div className="container w-full flex justify-between">
				<div className="flex items-center pl-4">
					{/* Figure out the next/link thing later */}
					<div>
						<a href="/">
							<Image src={logo} height="42" width="42" />
						</a>
					</div>
					<div className="pl-2 font-bold">
						<a href="/">DogBnB</a>
					</div>
				</div>
				<div className="search"></div>
				<div className="flex items-center pr-4 relative">
					<div
						className="flex items-center border-2 rounded-full px-2 py-1 cursor-pointer"
						onClick={openProfileMenu}
					>
						<div>
							<MenuIcon className="h-5 w-5 text-slate-600" />{" "}
						</div>
						<div className="pl-2">
							{login.loggedIn ? (
								<div className="h-7 w-7 text-white bg-slate-600 rounded-full flex justify-center items-center">
									{login.username.charAt(0).toUpperCase()}
								</div>
							) : (
								<UserCircleIcon className="h-7 w-7 text-slate-600" />
							)}
						</div>
						{/* <div className="pl-2">
							
						</div> */}
					</div>
					<nav>
						<DropdownWrapper
							className="top-14 right-4"
							ref={profileMenuRef}
						>
							{login.loggedIn && (
								<>
									<Link href="/profile">
										<li>Profile</li>
									</Link>
									<Link href="/reservations">
										<li>Reservations</li>
									</Link>
									<li onClick={logout}>Log Out</li>
									<hr />
									<li>Rent Your Dog</li>
								</>
							)}
							{!login.loggedIn && (
								<>
									<li onClick={openSignupModal}>Sign Up</li>
									<li onClick={openLoginModal}>Log In</li>
								</>
							)}
						</DropdownWrapper>
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Header;
