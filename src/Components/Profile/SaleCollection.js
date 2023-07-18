import React, { useState, useEffect } from "react";
import axios from "axios";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
// import { getSaleNFTsScript } from "../../cadence/scripts/get_sale_nfts.js";
import { unlistFromSaleTx } from "../../cadence/transactions/unlist_from_sale.js";

function SaleCollection(props) {
	const [user, setUser] = useState();
	const [nfts, setNFTs] = useState(props.nfts);

	useEffect(() => {
		fcl.currentUser().subscribe(setUser);
	}, []);

	const cancel = async (id) => {
		if (!window.confirm("Do you want to unlist this NFTs?")) return;

		const transactionId = await fcl
			.send([
				fcl.transaction(unlistFromSaleTx),
				fcl.args([fcl.arg(parseInt(id), t.UInt64)]),
				fcl.payer(fcl.authz),
				fcl.proposer(fcl.authz),
				fcl.authorizations([fcl.authz]),
				fcl.limit(9999),
			])
			.then(fcl.decode);

		fcl.tx(transactionId)
			.onceSealed()
			.then(() => {
				axios.delete(
					`${process.env.REACT_APP_SERVER_URL}/flow_nft/${user?.addr}`,
					{
						nftID: id,
					}
				);

				setNFTs((prevNfts) => {
					delete prevNfts[id];
					return { ...prevNfts };
				});
			})
			.catch((e) => {
				alert(
					"ERROR!! While Unlisting The NFT, PLEASE check console for furthur info!!"
				);
				console.log(e);
			});

		// for deleting from list
	};

	return (
		<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-4 px-2">
			{nfts && Object.keys(nfts).length != 0 ? (
				Object.keys(nfts).map((nftID) => (
					<div
						key={nftID}
						className="nft-card max-w-[250px] flex flex-col border-2 border-[#a3a3a3] rounded-[15px] relative"
					>
						<h1 className="absolute top-0 left-0 bg-[#fe6015] px-2 rounded-tl-[15px] leading-[35px] text-white text-[18px] font-bold z-10">
							#{nftID}
						</h1>
						<div className="flip-card">
							<img
								className="w-full aspect-square bg-[#fff1d0] rounded-t-[15px] "
								src={`https://ipfs.io/ipfs/${nfts[nftID].nftRef.ipfsHash}`}
								alt=""
							/>

							<button
								onClick={() => cancel(nftID)}
								className="cancel-listing-btn text-center font-bold leading-[40px] text-white capitalize bg-[#f13d3d] absolute rounded-t-[15px] px-3 bottom-[65px] right-[5px] opacity-0 duration-150"
							>
								Cancel Listing
							</button>
						</div>
						<h1 className="text-center font-bold leading-[30px] text-white capitalize">
							{nfts[nftID].nftRef.metadata.name}
						</h1>
						<h1 className="text-center font-bold leading-[30px] text-white capitalize">
							Price: {nfts[nftID].price}
						</h1>
					</div>
				))
			) : (
				<h2 className="mx-auto text-[25px] text-[#565656] py-8 capitalize">
					NO NFT LISTED FOR SALE
				</h2>
			)}
		</div>
	);
}

export default SaleCollection;
