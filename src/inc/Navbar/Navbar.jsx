import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import AuthBtn from "./AuthBtn";

const Navbar = () => {
	const [openDrawer, setOpenDrawer] = useState(false);

	const toggleDrawer = () => {
		setOpenDrawer((prevOpenDrawer) => !prevOpenDrawer);
	};
	return (
		<div id="header" className="bg-[#4d4d4d]">
			<div className="md:flex items-center justify-between max-w-[1280px] mx-auto relative">
				<div
					className="flex items-center text-white justify-between w-[100%]
					md:w-[auto] py-2 px-4
				"
				>
					<Link to="/">
						<div className="flex">
							<img
								src="/assets/images/logo.png"
								className="h-14"
							/>
						</div>
					</Link>

					<AiOutlineMenu
						className="w-[30px] h-[30px] cursor-pointer leading-[30px] text-center md:hidden"
						onClick={toggleDrawer}
					/>
				</div>

				<div
					className={
						(!openDrawer ? "max-h-0 " : "max-h-screen ") +
						"md:max-h-[100%] h-auto flex flex-col text-center gap-1 md:flex-row md:w-[auto] md:h-[100%] md:overflow-visible overflow-hidden ease-in-out duration-150 px-4 bg-[#5b5b5b] md:bg-transparent absolute md:relative top-[104%] right-4 rounded-[8px]"
					}
				>
					<div
						className="flex text-lg flex-col gap-1 leading-[40px] text-[16px]
				md:flex-row md:text-[18px]
				"
					>
						<Link to="/" className="block md:mt-0 mt-2">
							<li className="text-white list-none capitalize px-4 hover:text-[#0ea5e9] hover:scale-105">
								Home
							</li>
						</Link>
					</div>

					<AuthBtn />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
