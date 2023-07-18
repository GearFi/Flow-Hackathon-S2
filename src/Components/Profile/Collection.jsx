import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Popup from "./ListingPopup";

export default function Collection(props) {
	const [showPopup, setShowPopup] = useState(false);
	const [nftData, setNftData] = useState([]);

	const listForSale = (nftID) => {
		setNftData({
			...props.nfts.find((e) => e.id == nftID),
		});
		setShowPopup(true);
	};

	const handlePopUpClose = (e) => {
		setShowPopup(false);
	};

	return (
		<>
			<div>
				{showPopup && (
					<MdClose
						className="fixed top-4 right-4 z-[1001] text-white text-[30px] cursor-pointer"
						onClick={handlePopUpClose}
					/>
				)}
				<Popup popup={showPopup} nftInfo={nftData} />
			</div>
			<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-4 px-2">
				{props.nfts && props.nfts.length != 0 ? (
					props.nfts.map((nft) => (
						<div
							key={nft.id}
							className="nft-card max-w-[250px] flex flex-col border-2 border-[#a3a3a3] rounded-[15px] relative"
						>
							<h1 className="absolute top-0 left-0 bg-[#fe6015] px-2 leading-[35px] rounded-tl-[15px] text-white text-[18px] font-bold z-10">
								#{nft.id}
							</h1>
							<div className="flip-card">
								<img
									className="w-full aspect-square bg-[#fff1d0] rounded-t-[15px] "
									src={`https://ipfs.io/ipfs/${nft.ipfsHash}`}
									alt=""
								/>
								<button
									onClick={() => listForSale(nft.id)}
									className="listing-btn text-center font-bold leading-[40px] text-white capitalize bg-[#009f92] absolute rounded-t-[15px] px-3 bottom-[65px] right-[5px] opacity-0 duration-150"
								>
									List For Sale
								</button>
							</div>
							<h1 className="text-center font-bold leading-[40px] text-white capitalize">
								{nft.metadata.name}
							</h1>
						</div>
					))
				) : (
					<h2 className="mx-auto text-[25px] text-[#565656] py-8 capitalize">
						NO NFT AVAILABLE
					</h2>
				)}
			</div>
		</>
	);
}
