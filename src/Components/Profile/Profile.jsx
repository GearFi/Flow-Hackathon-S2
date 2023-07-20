import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdClose } from "react-icons/md";
import Collection from "./Collection";
import SaleCollection from "./SaleCollection";
import MintPopup from "./MintPopup";

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

import { setupUserTx } from "../../cadence/transactions/setup_user";
import { getNFTsScript } from "../../cadence/scripts/get_nfts.js";
import { getSaleNFTsScript } from "../../cadence/scripts/get_sale_nfts.js";
import BNPLCollection from "./BNPLCollection";

const Profile = () => {
	const [user, setUser] = useState();
	const [isLoggedInUser, setIsLoggedInUser] = useState(true);
	const params = useParams();
	const [openTab, setOpenTab] = useState("nft");
	const [officialAddress, setOfficialAddress] = useState("");
	const [mintPop, setMintPop] = useState(false);

	const [isAccountSetup, setIsAccountSetup] = useState(false);
	const [nfts, setNFTs] = useState([]);
	const [listedNfts, setListedNFTs] = useState({});

	useEffect(() => {
		fcl.currentUser().subscribe(setUser);
	}, []);

	useEffect(() => {
		if (officialAddress) {
			getUserNFTs();
			getUserSaleNFTs();
		}
	}, [officialAddress, isAccountSetup]);

	useEffect(() => {
		if (params.addr && user && user.addr) {
			setOfficialAddress(params.addr);
			if (params.addr != user.addr) setIsLoggedInUser(false);
		}
	}, [params, user]);

	const getUserNFTs = async () => {
		const result = await fcl
			.send([
				fcl.script(getNFTsScript),
				fcl.args([fcl.arg(officialAddress, t.Address)]),
			])
			.then(fcl.decode)
			.catch((err) => {
				// console.log(err);
				alert("Unable to fetch NFT");
			});

		if (result) {
			setIsAccountSetup(true);
			setNFTs(result);
		}
	};

	const getUserSaleNFTs = async () => {
		const result = await fcl
			.send([
				fcl.script(getSaleNFTsScript),
				fcl.args([fcl.arg(officialAddress, t.Address)]),
			])
			.then(fcl.decode)
			.catch((err) => {
				// console.log(err);
				alert("Unable to fetch listed NFT");
			});

		if (result) {
			setIsAccountSetup(true);
			setListedNFTs(result);
		}
	};

	const setupUser = async () => {
		const transactionId = await fcl
			.send([
				fcl.transaction(setupUserTx),
				fcl.args([]),
				fcl.payer(fcl.authz),
				fcl.proposer(fcl.authz),
				fcl.authorizations([fcl.authz]),
				fcl.limit(9999),
			])
			.then(fcl.decode);

		fcl.tx(transactionId)
			.onceSealed()
			.then(() => {
				setIsAccountSetup(true);
			});
	};

	const openMintNFTPopup = () => {
		setMintPop(true);
	};

	const handleMintPopUpClose = (e) => {
		setMintPop(false);
	};

	return (
		<div className="max-w-[1280px] mx-auto p-[10px]">
			<div
				id="profile_top"
				className="pt-8 border-b-2 border-[#d7d7d7] box-border"
			>
				<div
					id="profile_info"
					className="flex justify-center items-center sm:flex-row flex-col"
				>
					<div className="w-[100px] h-[50px] rounded-[25px] bg-gradient-to-tr from-[#ffd924] to-[#fe3310]"></div>
					<div className="sm:pl-5 sm:pt-0 pt-5 text-[20px] text-[#b7b7b7]">
						{officialAddress}
					</div>
					<div>
						{user &&
						user?.addr &&
						officialAddress &&
						user?.addr === officialAddress &&
						!isAccountSetup ? (
							<button
								className="leading-[40px] rounded-[20px] bg-[#fff] text-[#262626] font-bold px-3 ml-3"
								onClick={setupUser}
							>
								SETUP
							</button>
						) : (
							isLoggedInUser && (
								<>
									<button
										className="leading-[40px] rounded-[20px] bg-[#fff] text-[#425] font-bold px-3 ml-3"
										onClick={openMintNFTPopup}
									>
										MINT NFT
									</button>

									{mintPop && (
										<MdClose
											className="fixed top-4 right-4 z-[1001] text-white text-[30px] cursor-pointer"
											onClick={handleMintPopUpClose}
										/>
									)}
									<MintPopup popup={mintPop} />
								</>
							)
						)}
					</div>
				</div>

				<div
					id="records"
					className="flex gap-[10px] justify-center items-center mt-16  sm:flex-row flex-col"
				>
					<div className="flex w-[200px] text-[20px]">
						<div className="w-2/3 text-[#fff] font-bold">
							Total NFTs:
						</div>
						<div className="w-1/3 text-[#b7b7b7] text-center">
							{isAccountSetup ? nfts.length : "-"}
						</div>
					</div>

					<div className="flex w-[200px] text-[20px]">
						<div className="w-2/3 text-[#fff] font-bold">
							Total Listing:
						</div>
						<div className="w-1/3 text-[#b7b7b7] text-center">
							{isAccountSetup
								? Object.keys(listedNfts).length
								: "-"}
						</div>
					</div>
				</div>

				<div
					id="tabs"
					className="flex justify-center mt-16 translate-y-[1.6px]"
				>
					<div
						data-filter="nft"
						onClick={(e) => {
							setOpenTab(e.target.dataset.filter);
						}}
						className={
							(openTab == "nft"
								? "border-b-[#262626] border-[#d7d7d7]"
								: "border-[transparent] border-b-[#d7d7d7]") +
							" border-2 border-b-2 rounded-t-[8px] px-4 leading-[40px] box-border text-[#b7b7b7] cursor-pointer"
						}
					>
						Own NFTs
					</div>

					<div
						data-filter="bnpl"
						onClick={(e) => {
							setOpenTab(e.target.dataset.filter);
						}}
						className={
							(openTab == "bnpl"
								? "border-b-[#262626] border-[#d7d7d7]"
								: "border-[transparent] border-b-[#d7d7d7]") +
							" border-2 border-b-2 rounded-t-[8px] px-4 leading-[40px] box-border text-[#b7b7b7] cursor-pointer"
						}
					>
						BNPL NFTs
					</div>

					<div
						data-filter="listing"
						onClick={(e) => {
							setOpenTab(e.target.dataset.filter);
						}}
						className={
							(openTab == "listing"
								? "border-b-[#262626] border-[#d7d7d7]"
								: "border-[transparent] border-b-[#d7d7d7]") +
							" border-2 border-b-2 rounded-t-[8px] px-4 leading-[40px] box-border text-[#b7b7b7] cursor-pointer"
						}
					>
						Listings
					</div>
				</div>
			</div>

			<div id="profile_bottom">
				{openTab === "nft" &&
				user &&
				user.addr &&
				officialAddress &&
				officialAddress !== "" ? (
					<Collection address={officialAddress} nfts={nfts} />
				) : null}

				{openTab === "bnpl" &&
				user &&
				user.addr &&
				officialAddress &&
				officialAddress !== "" ? (
					<BNPLCollection address={officialAddress} nfts={nfts} />
				) : null}

				{openTab === "listing" &&
				user &&
				user.addr &&
				officialAddress &&
				officialAddress !== "" ? (
					<SaleCollection
						address={officialAddress}
						nfts={listedNfts}
					/>
				) : null}
			</div>
		</div>
	);
};

export default Profile;
