import React from "react";
import { useNavigate } from "react-router-dom";

import { AiOutlineArrowRight } from "react-icons/ai";

export default function Banner2() {
	return (
		<div className="text-white mt-10 w-full px-[20px]">
			<div className="md:flex justify-center gap-4 ">
				<div
					className="flex flex-col md:w-1/2 justify-center items-start px-2 text-center
				 md:text-left items-center md:items-start mb-10"
				>
					<div className="text-5xl font-bold text-gradient">
						Buy Now Pay Later and Margin Trading for NFTs
					</div>
					<div className="w-2/3 text-gradient my-4">
						Trade Top NFT collections on a fraction of price, access
						liquidty from GearFi Vaults
					</div>
				</div>

				<div
					className="white-glassmorphism max-w-[90%] h-[fit-content] rounded-none py-4 px-4 align-self-left mx-auto
					sm:max-w-[50%]
				"
				>
					<div
						className="flex md:h-72 md:m-4 m-0 card items-end cursor-pointer bg-cover bg-center aspect-square pb-4 justify-center"
						style={{
							backgroundImage: `url('/assets/images/banner.png')`,
						}}
					></div>
				</div>
			</div>
		</div>
	);
}
