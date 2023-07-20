import React, { useEffect, useState } from "react";
import axios from "axios";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { purchaseTx } from "../../cadence/transactions/purchase.js";

const Discover = () => {
	const [user, setUser] = useState();
	const [nftArr, setNftArr] = useState([]);

	useEffect(() => {
		fcl.currentUser().subscribe(setUser);
	}, []);

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_SERVER_URL}/flow_nft`)
			.then((res) => {
				setNftArr(res?.data?.data);
			});
	}, []);

	const purchase = async (id, address, price) => {
		if (!user || !user.addr) {
			fcl.authenticate();
			return;
		}
		const transactionId = await fcl
			.send([
				fcl.transaction(purchaseTx),
				fcl.args([fcl.arg(address, t.Address), fcl.arg(id, t.UInt64)]),
				fcl.payer(fcl.authz),
				fcl.proposer(fcl.authz),
				fcl.authorizations([fcl.authz]),
				fcl.limit(9999),
			])
			.then(fcl.decode);

		fcl.tx(transactionId)
			.onceSealed()
			.then(() => {
				axios.patch(
					`${process.env.REACT_APP_SERVER_URL}/flow_nft/${address}/${id}`,
					{
						state: "BNPL",
						owner: user.addr,
						price: price * 0.7,
					}
				);

				alert("Your Purchase Made successfully!!");
			});
	};

	return (
		<div className="max-w-[1280px] mx-auto p-[10px]">
			<h2 className="mt-14 text-xl text-white text-center">
				Discover NFTs
			</h2>

			<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-4 px-2 py-3">
				{nftArr && nftArr.length !== 0 ? (
					nftArr.map(
						(nft) =>
							nft.state === "LISTED" && (
								<div
									key={nft.nftID}
									className="nft-card max-w-[250px] flex flex-col border-2 border-[#a3a3a3] rounded-[15px] relative"
								>
									<h1 className="absolute top-0 left-0 bg-[#fe6015] px-2 leading-[35px] rounded-tl-[15px] text-white text-[18px] font-bold z-10">
										#{nft.nftID}
									</h1>
									<div className="flip-card">
										<img
											className="w-full aspect-square bg-[#fff1d0] rounded-t-[15px] "
											src={`https://ipfs.io/ipfs/${nft.cid}`}
											alt=""
										/>
										<button
											onClick={() => {
												purchase(
													nft.nftID,
													nft.owner,
													nft.price
												);
											}}
											className="listing-btn font-bold leading-[40px] text-white capitalize absolute rounded-t-[15px] px-3 bottom-[65px] right-[5px] opacity-0 duration-150"
										>
											Purchase NFT
											<br />
											<div className="text-2xl font-semibold">
												Price: {nft.price} FLOW
											</div>
										</button>
									</div>
									<div className="text-center">
										<div className="text-white font-bold">
											Price: {nft.price}
										</div>
										<div className="text-white font-bold">
											Downpayment: 30%
										</div>
										<h1 className="font-bold leading-[40px] text-white capitalize">
											{nft.nftName}
										</h1>
									</div>
								</div>
							)
					)
				) : (
					<h2 className="mx-auto text-[25px] text-[#565656] py-8 capitalize">
						NO NFT AVAILABLE
					</h2>
				)}
			</div>
		</div>
	);
};

export default Discover;
