import React, { useEffect, useState } from "react";
import axios from "axios";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { repayLoanTx } from "../../cadence/transactions/repay_loan.js";

const RepayPopup = (props) => {
	const [user, setUser] = useState();
	const [pop, setPop] = useState(false);
	const [amt, setAmt] = useState(0);
	const [errMsg, setErrMsg] = useState("");

	useEffect(() => {
		setPop(props.popup);
	}, [props.popup]);

	useEffect(() => {
		fcl.currentUser().subscribe(setUser);
	}, []);

	const repayLoan = async (e, id) => {
		e.preventDefault();

		if (amt <= 0 || isNaN(amt)) {
			return setErrMsg("Amount must be more than Zero");
		}

		if (props?.nftInfo?.price < amt) {
			return setErrMsg(
				"Repay Amount must be less or equal to than loan Amount"
			);
		}

		setErrMsg("");

		const transactionId = await fcl
			.send([
				fcl.transaction(repayLoanTx),
				fcl.args([
					fcl.arg(parseInt(props?.nftInfo?.nftID), t.UInt64),
					fcl.arg(amt.toFixed(8), t.UFix64),
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
				if (props?.nftInfo?.price - amt.toFixed(8) > 0) {
					axios.patch(
						`${process.env.REACT_APP_SERVER_URL}/flow_nft/${user?.addr}/${props?.nftInfo?.nftID}`,
						{
							price: parseFloat(
								props?.nftInfo?.price - amt.toFixed(8)
							),
						}
					);
				} else {
					axios.patch(
						`${process.env.REACT_APP_SERVER_URL}/flow_nft/${user?.addr}/${props?.nftInfo?.nftID}`,
						{
							state: "REPAID",
						}
					);
				}

				alert("NFT Repayed SUCCESSFULLY!!");
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
					repayLoan(e);
				}}
			>
				<div className="text-2xl text-center">
					Repay the loan for your NFT
				</div>

				<img
					src={`https://ipfs.io/ipfs/${props?.nftInfo?.cid}`}
					className="w-[200px] max-w-[100%] rounded-[8px] aspect-square mx-auto my-5"
					alt=""
				/>

				<input
					className="text-lg text-black mb-5 block w-full leading-[40px] bg-[#d7d7d7] border-0 rounded-[5px] outline-0 px-4"
					type="text"
					id="marginPrice"
					placeholder="Amount"
					onChange={(e) => setAmt(parseFloat(e.target.value))}
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
					Repay
				</button>
			</form>
		</div>
	);
};

export default RepayPopup;
