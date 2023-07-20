import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { get_user_balance } from "../../cadence/scripts/get_user_balance.js";
import { depositStake } from "../../cadence/transactions/stake.js";
import { withdrawStake } from "../../cadence/transactions/withdraw_stake.js";
import AuthBtn from "../../inc/Navbar/AuthBtn.jsx";

const Stacking = ({ vaultBalance }) => {
	const [active, setActive] = useState("deposit");
	const [user, setUser] = useState();
	const [userBalance, setUserBalance] = useState("{-}");
	const [errMsg, setErrMsg] = useState(); // for ERROR

	useEffect(() => {
		fcl.currentUser().subscribe(setUser);
	}, []);

	const getUserBalance = async () => {
		if (!user || !user.addr) return setUserBalance("{-}");

		const balance = await fcl
			.send([
				fcl.script(get_user_balance),
				fcl.args([fcl.arg(user.addr, t.Address)]),
			])
			.then(fcl.decode)
			.catch((err) => {
				console.log(err);
			});
		setUserBalance(balance);
	};

	useEffect(() => {
		getUserBalance();
	}, [user]);

	const deposit = async (amount) => {
		if (!user || !user.addr) {
			fcl.authenticate();
			return;
		}

		amount = parseFloat(amount);
		if (amount <= 0)
			return setErrMsg("Deposit amount must be greated than 0");

		const transactionId = await fcl
			.send([
				fcl.transaction(depositStake),
				fcl.args([fcl.arg(amount.toFixed(8), t.UFix64)]),
				fcl.payer(fcl.authz),
				fcl.proposer(fcl.authz),
				fcl.authorizations([fcl.authz]),
				fcl.limit(9999),
			])
			.then(fcl.decode);
		fcl.tx(transactionId)
			.onceSealed()
			.then(() => {
				alert("You successfully staked FLOW tokens");
			})
			.catch((err) => {
				alert(
					"ERROR: While making deposite, Please check console for more info"
				);
			});
	};
	const withdraw = async (amount) => {
		if (!user || !user.addr) {
			fcl.authenticate();
			return;
		}

		amount = parseFloat(amount);
		if (amount <= 0)
			return setErrMsg("Withdraw amount must be greated than 0");

		const transactionId = await fcl
			.send([
				fcl.transaction(withdrawStake),
				fcl.args([fcl.arg(amount.toFixed(8), t.UFix64)]),
				fcl.payer(fcl.authz),
				fcl.proposer(fcl.authz),
				fcl.authorizations([fcl.authz]),
				fcl.limit(9999),
			])
			.then(fcl.decode);

		fcl.tx(transactionId)
			.onceSealed()
			.then(() => {
				alert("Withdraw Amount added to your balance");
			})
			.catch((err) => {
				alert(
					"ERROR: While making deposite, Please check console for more info"
				);
			});
	};

	return (
		<div className="mt-8">
			{user && user.addr ? (
				<div className="text-white">
					{active === "deposit" ? (
						<div className="text-xl mt-4 text-center mb-4">
							Deposit SHM into vault
						</div>
					) : (
						<div className="text-xl mt-4 text-center mb-4">
							Withdraw SHM from vault
						</div>
					)}
					<div className="border border-slate-500 rounded-[5px]">
						<div className="flex justify-center ">
							<div
								className={`m-4 p-4 !rounded-[5px] ${
									active === "deposit"
										? "bg-slate-700"
										: "white-glassmorphism"
								} 
    cursor-pointer`}
								onClick={() => {
									setActive("deposit");
								}}
							>
								Deposit
							</div>
							<div
								className={`m-4 p-4 !rounded-[5px] ${
									active === "withdraw"
										? "bg-slate-700"
										: "white-glassmorphism"
								} 
    cursor-pointer`}
								onClick={() => {
									setActive("withdraw");
								}}
							>
								Withdraw
							</div>
						</div>

						{active === "deposit" && (
							<div>
								<div className="flex w-5/6 justify-between p-4 m-4 rounded-md items-center mx-auto">
									<div className="flex flex-col  gap-[8px]">
										<div>Amount</div>
										<div>
											<input
												type="text"
												placeholder="0.0"
												className=" bg-transparent h-[30px] border-[1px] rounded-[5px] text-center border-white px-2"
												id="depositAmount"
											/>
										</div>
									</div>

									<div className="flex flex-col gap-[8px]">
										<div>
											Your Balance: {userBalance} SHM
										</div>
										<div>
											Vault Balance: {vaultBalance} SHM
										</div>
									</div>
								</div>

								<div className="text-red-400 text-sm my-[10px]">
									{errMsg}
								</div>

								<div className="flex justify-center">
									<button
										className="text-[#0ea5e9] bg-gray-800 border-2 border-gray-900 items-center px-3 py-2 text-lg font-medium text-center  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4"
										onClick={() => {
											deposit(
												document.getElementById(
													"depositAmount"
												).value
											);
										}}
									>
										Deposit
									</button>
								</div>
							</div>
						)}
						{active === "withdraw" && (
							<div>
								<div className="flex w-5/6 justify-between p-4 m-4 rounded-md items-center mx-auto">
									<div className="flex flex-col gap-[8px]">
										<div>Amount</div>
										<div>
											<input
												type="text"
												placeholder="0.0"
												className="bg-transparent h-[30px] border-[1px] rounded-[5px] text-center border-white px-2"
												id="withdrawAmount"
											/>
										</div>
									</div>

									<div className="flex flex-col gap-[8px]">
										<div>
											Your Balance: {userBalance} SHM
										</div>
									</div>
								</div>

								<div className="text-red-400 text-sm my-[10px]">
									{errMsg}
								</div>

								<div className="flex justify-center">
									<button
										className="text-[#0ea5e9] bg-gray-800 items-center px-3 py-2 text-lg font-medium text-center border-2 border-gray-900  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4"
										onClick={() => {
											withdraw(
												document.getElementById(
													"withdrawAmount"
												).value
											);
											document.getElementById(
												"withdrawAmount"
											).innerText = "0.0";
										}}
									>
										Withdraw
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			) : (
				<AuthBtn />
			)}
		</div>
	);
};

export default Stacking;
