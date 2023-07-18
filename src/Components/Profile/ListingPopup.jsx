import React, { useEffect, useState } from "react";
import axios from "axios";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { listForSaleTx } from "../../cadence/transactions/list_for_sale.js";

const Popup = (props) => {
	const [user, setUser] = useState();
	const [pop, setPop] = useState(false);
	const [price, setPrice] = useState(0);
	const [errMsg, setErrMsg] = useState("");

	useEffect(() => {
		setPop(props.popup);
	}, [props.popup]);

	useEffect(() => {
		fcl.currentUser().subscribe(setUser);
	}, []);

	const listForSale = async (e, id) => {
		e.preventDefault();

		if (price <= 0 || isNaN(price)) {
			return setErrMsg("Price must be more than Zero");
		}
		setErrMsg("");

		const transactionId = await fcl
			.send([
				fcl.transaction(listForSaleTx),
				fcl.args([
					fcl.arg(parseInt(id), t.UInt64),
					fcl.arg(price.toFixed(8), t.UFix64),
				]),
				fcl.payer(fcl.authz),
				fcl.proposer(fcl.authz),
				fcl.authorizations([fcl.authz]),
				fcl.limit(9999),
			])
			.then(fcl.decode);

		fcl.tx(transactionId)
			.onceSealed()
			.then(() => {
				axios.post(`${process.env.REACT_APP_SERVER_URL}/flow_nft`, {
					state: "LISTED",
					owner: user?.addr,
					nftID: props?.nftInfo?.id,
					cid: props?.nftInfo?.ipfsHash,
					nftName: props?.nftInfo?.metadata?.name,
					price: price.toFixed(8),
				});

				alert("NFT LISTED SUCCESSFULLY!!");
			})
			.catch((e) => {
				alert(
					"There is some error while listing NFT, PLEASE check your console for more info"
				);
				console.log(e);
			});

		return;
	};

	return (
		<div
			className={
				(pop && "!top-0") +
				" fixed z-[1000] w-full h-full top-[100%] left-0 duration-300 bg-[#0005] glassmorphism bg-[#262626aa] flex justify-center items-center px-[10px]"
			}
		>
			<form
				className="bg-[#fefefe] p-8 rounded-[20px] border-4 border-[#bb7b7] w-[100%] max-w-[540px]"
				onSubmit={(e) => {
					listForSale(e, props.nftInfo.id);
				}}
			>
				<div className="text-2xl text-center">
					Put your NFT's for margin sale
				</div>

				<img
					src={`https://ipfs.io/ipfs/${props?.nftInfo?.ipfsHash}`}
					className="w-[200px] max-w-[100%] rounded-[8px] aspect-square mx-auto my-5"
					alt=""
				/>

				<input
					className="text-lg text-black mb-5 block w-full leading-[40px] bg-[#d7d7d7] border-0 rounded-[5px] outline-0 px-4"
					type="text"
					id="marginPrice"
					placeholder="Enter Price for NFT"
					onChange={(e) => setPrice(parseFloat(e.target.value))}
				/>
				{errMsg && (
					<span className="text-[#e11] text-[14px] mb-5 block text-center">
						{errMsg}
					</span>
				)}
				<button
					type="submit"
					className="rounded-[5px] bg-[#2a2a2a] text-xl leading-[40px] text-white px-3 mx-auto block"
				>
					List for Sale
				</button>
			</form>
		</div>
	);
};

export default Popup;
