import React, { useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { auth } from "../lib/firebase";
import { Context } from "./store";
import DropdownWrapper from "./ui/dropdown";

import logo from "../assets/logo.png";
import { HiMenu } from "react-icons/hi";
import { HiUserCircle } from "react-icons/hi";

const Header = ({ position }) => {
	const { loginModalRef, user } = useContext(Context);

	const profileMenuRef = useRef();

	const openAuthModal = () => {
		loginModalRef.current.openModal();
	};

	const openProfileMenu = () => {
		profileMenuRef.current.openMenu();
	};

	const logout = () => {
		auth.signOut();
		window.localStorage.removeItem("login");
	};

	return (
		<header
			className={`${position} top-0 w-full h-16 shadow-md flex justify-center bg-red-400 z-10`}
		>
			<div className="container w-full flex justify-between">
				<div className="flex items-center pl-4">
					<div>
						<Link href="/">
							<a>
								<Image src={logo} height="42" width="42" />
							</a>
						</Link>
					</div>
					<div className="pl-2 font-bold">
						<Link href="/">
							<a>DogBnB</a>
						</Link>
					</div>
				</div>
				<div className="search"></div>
				<div className="flex items-center pr-4 relative">
					<div
						className="flex items-center border-2 border-slate-800 rounded-full px-2 py-1 cursor-pointer"
						onClick={openProfileMenu}
					>
						<div>
							<HiMenu className="h-5 w-5 text-slate-800" />{" "}
						</div>
						<div className="pl-2">
							{user ? (
								<div className="h-7 w-7 text-white bg-slate-800 rounded-full flex justify-center items-center overflow-hidden relative">
									{user.photoURL ? (
										<Image
											src={user.photoURL}
											layout="fill"
											objectFit="cover"
											alt="user profile picture"
										/>
									) : (
										user.displayName.charAt(0).toUpperCase()
									)}
								</div>
							) : (
								<HiUserCircle className="h-7 w-7 text-slate-800" />
							)}
						</div>
					</div>
					<nav>
						<DropdownWrapper
							className="top-14 right-4"
							ref={profileMenuRef}
						>
							{user && (
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
							{!user && (
								<>
									<li
										onClick={openAuthModal}
										className="rounded-md"
									>
										Log In/Sign Up
									</li>
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
