import React from "react";
import Banner from "./Banner";
import Discover from "./Discover";
import Wallet from "./Wallet";

const Home = () => {
	return (
		<div id="home">
			<div className="flex flex-col justify-center text-white items-center max-w-[1280px] mx-auto">
				<Banner />
				<p className="text-sm  text-red-400 text-center w-[90%] mt-8">
					Disclaimer: NFTs displayed are for testing purposes only and
					do not represent ownership of original collections.
				</p>
			</div>

			<Discover />

			<Wallet />
		</div>
	);
};

export default Home;
