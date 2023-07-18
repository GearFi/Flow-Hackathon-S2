import React, { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { mintNFT } from "../../cadence/transactions/mint_nft";

const Popup = (props) => {
	const [pop, setPop] = useState(false);
	const [input, setInput] = useState({});
	const [errMsg, setErrMsg] = useState("");

	useEffect(() => {
		setPop(props.popup);
	}, [props.popup]);

	console.log(props);

	const mint = async (e) => {
		e.preventDefault();

		if (!input?.name || !input?.cid) {
			return setErrMsg("All Fields are Required");
		}

		try {
			//const added = await client.add(file)
			//const hash = added.path

			const transactionId = await fcl
				.send([
					fcl.transaction(mintNFT),
					fcl.args([
						fcl.arg(input.cid, t.String),
						fcl.arg(input.name, t.String),
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
					alert(`${input.name} Minted Successfully!!`);
				})
				.catch((e) => {
					alert(
						`ERROR: while Minting ${input.name}, PLEASE check CONSOLE for more INFO`
					);
					console.log(e);
				});
		} catch (error) {
			console.log("Error uploading file: ", error);
		}
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
				onSubmit={mint}
			>
				<div className="text-2xl text-center mb-5">Mint a new NFT</div>

				<input
					className="text-lg text-black mb-5 block w-full leading-[40px] bg-[#d7d7d7] border-0 rounded-[5px] outline-0 px-4"
					type="text"
					id="marginPrice"
					placeholder="Provide NFT name"
					onChange={(e) =>
						setInput((prevInput) => ({
							...prevInput,
							name: e.target.value,
						}))
					}
				/>

				<input
					className="text-lg text-black mb-5 block w-full leading-[40px] bg-[#d7d7d7] border-0 rounded-[5px] outline-0 px-4"
					type="text"
					id="marginPrice"
					placeholder="Provide NFT CID"
					onChange={(e) =>
						setInput((prevInput) => ({
							...prevInput,
							cid: e.target.value,
						}))
					}
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
					Mint NFT
				</button>
			</form>
		</div>
	);
};

export default Popup;
