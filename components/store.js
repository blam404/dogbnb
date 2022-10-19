import React, { createContext, useRef, useState } from "react";
import { auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import AuthLogin from "./authLogin";

export const Context = createContext();

const Store = ({ children }) => {
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();

	const loginModalRef = useRef();

	const [user, loading] = useAuthState(auth);

	return (
		<Context.Provider
			value={{
				loading,
				user,
				startDate,
				setStartDate,
				endDate,
				setEndDate,
				loginModalRef,
			}}
		>
			<AuthLogin ref={loginModalRef} />
			{children}
		</Context.Provider>
	);
};

export default Store;
