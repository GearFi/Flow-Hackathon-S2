import React, { useState, useEffect } from "react";
import axios from "axios";
import RepayPopup from "./RepayPopup";
import { MdClose } from "react-icons/md";

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { claim_nft } from "../../cadence/transactions/claim_nft";

export default function BNPLCollection() {
	const [user, setUser] = useState();
	const [nftArr, setNftArr] = useState([]);
	const [showPopup, setShowPopup] = useState(false);
	const [nftData, setNftData] = useState([]);

	useEffect(() => {
		fcl.currentUser().subscribe(setUser);
	}, []);

	const repayPopup = (nftID) => {
		setNftData({
			...nftArr.find((e) => e.id == nftID),
		});
		setShowPopup(true);
	};

	const claimNFT = async (id) => {
		const transactionId = await fcl
			.send([
				fcl.transaction(claim_nft),
				fcl.args([fcl.arg(id, t.UInt64)]),
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

				alert("NFT Claimed Successfully!!");
			})
			.catch((err) => {
				alert(
					"Error : while executing Claim NFT, for more info please check console"
				);

				console.log(err);
			});
	};

	const handlePopUpClose = (e) => {
		setShowPopup(false);
	};

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_SERVER_URL}/flow_nft`)
			.then((res) => {
				setNftArr(res?.data?.data);
			});
	}, []);

	return (
		<>
			<div>
				{showPopup && (
					<MdClose
						className="fixed top-4 right-4 z-[1001] text-white text-[30px] cursor-pointer"
						onClick={handlePopUpClose}
					/>
				)}
				<RepayPopup popup={showPopup} nftInfo={nftData} />
			</div>
			<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-4 px-2">
				{nftArr && nftArr.length != 0 ? (
					nftArr.map(
						(nft) =>
							user &&
							user.addr &&
							user.addr === nft.owner &&
							(nft.state === "BNPL" ||
								nft.state === "REPAID") && (
								<div
									key={nft.nftID}
									className="nft-card max-w-[250px] flex flex-col border-2 border-[#a3a3a3] rounded-[15px] relative"
								>
									<h1 className="absolute top-0 left-0 bg-[#fe6015] px-2 leading-[35px] rounded-tl-[15px] text-white text-[18px] font-bold z-10">
										#{nft.nftID} | {nft.state}
									</h1>
									<div className="flip-card">
										<img
											className="w-full aspect-square bg-[#fff1d0] rounded-t-[15px] "
											src={`https://ipfs.io/ipfs/${nft.cid}`}
											alt=""
										/>
										{nft.state === "BNPL" ? (
											<button
												onClick={() => {
													repayPopup();
												}}
												className="listing-btn text-center font-bold leading-[40px] text-white capitalize bg-[#839442] absolute rounded-t-[15px] px-3 bottom-[65px] right-[5px] opacity-0 duration-150"
											>
												Repay Loan
											</button>
										) : (
											<button
												onClick={() => {
													claimNFT();
												}}
												className="listing-btn text-center font-bold leading-[40px] text-white capitalize bg-[#abf932] absolute rounded-t-[15px] px-3 bottom-[65px] right-[5px] opacity-0 duration-150"
											>
												Claim NFT
											</button>
										)}
									</div>
									<h1 className="text-center font-bold leading-[40px] text-white capitalize">
										{nft.nftName}
									</h1>
								</div>
							)
					)
				) : (
					<h2 className="mx-auto text-[25px] text-[#565656] py-8 capitalize">
						NO NFT AVAILABLE
					</h2>
				)}
			</div>
		</>
	);
}
