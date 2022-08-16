import React, { createContext, useEffect, useRef, useState } from "react";

import LogIn from "./login";
import SignUp from "./signup";

export const Context = createContext();

const Store = ({ children }) => {
	const [login, setLogin] = useState({ loggedIn: false, username: null });
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();

	const loginModalRef = useRef();
	const signUpModalRef = useRef();

	useEffect(() => {
		const data = window.localStorage.getItem("login");

		if (data && !login.loggedIn) {
			setLogin(JSON.parse(data));
		}
	}, [login]);

	return (
		<Context.Provider
			value={{
				login,
				setLogin,
				startDate,
				setStartDate,
				endDate,
				setEndDate,
				loginModalRef,
				signUpModalRef,
			}}
		>
			<SignUp ref={signUpModalRef} />
			<LogIn ref={loginModalRef} signUpModalRef={signUpModalRef} />
			{children}
		</Context.Provider>
	);
};

export default Store;
