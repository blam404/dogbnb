import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import classNames from "classnames";

// position (top, right, bottom left) has be passed as className since tailwind cannot do dynamic classes

const DropdownWrapper = forwardRef(
	({ children, className, handleShowMenu }, ref) => {
		const [showMenu, setShowMenu] = useState(false);
		const dropdownRef = useRef();

		useImperativeHandle(ref, () => {
			return {
				toggleMenu: () => toggleMenu(),
			};
		});
		const toggleMenu = () => {
			setShowMenu(!showMenu);
		};

		const handleClickOutsideProfile = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.parentNode.parentNode.contains(
					event.target
				)
			) {
				setShowMenu(false);
			}
		};

		useEffect(() => {
			if (showMenu) {
				document.addEventListener("click", handleClickOutsideProfile);
				return () => {
					document.removeEventListener(
						"click",
						handleClickOutsideProfile
					);
				};
			}
		}, [showMenu]);

		const wrapperClass = classNames("absolute w-max", className);

		return showMenu ? (
			<div
				className={wrapperClass}
				onClick={handleShowMenu}
				ref={dropdownRef}
			>
				<div className="dropdown-wrapper border bg-white shadow-md rounded-md">
					<ul className="list-none">{children}</ul>
				</div>
			</div>
		) : (
			<></>
		);
	}
);

export default DropdownWrapper;
