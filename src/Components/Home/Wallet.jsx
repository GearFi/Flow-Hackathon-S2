import React, { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import { get_loanvault_balance } from "../../cadence/scripts/get_loanvault_balance.js";

const Wallet = () => {
	const [loanBalance, setLoanBalance] = useState("-");

	useEffect(() => {
		getLoanBalance();
	}, []);

	const getLoanBalance = async () => {
		const balance = await fcl
			.send([fcl.script(get_loanvault_balance), fcl.args([])])
			.then(fcl.decode)
			.catch((err) => {
				console.log(err);
			});
		setLoanBalance(balance);
		console.log("loan vault balance is: ", balance);
	};

	return (
		<div
			id="wallet"
			className="max-w-[1280px] mx-auto p-[10px] text-center mt-16 pb-8"
		>
			<div className="white-glassmorphism max-w-[720px] w-[95%] rounded-[10px] mx-auto p-4 ">
				<div class="my-4 text-3xl text-red-200">
					Loan Vault Information
				</div>
				<div className="flex justify-center align-center mt-8 text-xl">
					<div className="text-white">Balance :&nbsp;</div>
					<div className="text-[#b7b7b7]"> {loanBalance} FLOW</div>
				</div>
			</div>
		</div>
	);
};

export default Wallet;
