import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import * as fcl from "@onflow/fcl";

fcl.config()
	.put("accessNode.api", "https://access-testnet.onflow.org")
	.put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");

const AuthBtn = () => {
	const [user, setUser] = useState();

	useEffect(() => {
		fcl.currentUser().subscribe(setUser);
	}, []);

	return (
		<div className="leading-[40px] text-[16px] md:text-[18px] md:mb-0 mb-2">
			{user && user.loggedIn ? (
				<Link to={`profile/${user.addr}`}>
					<div id="auth_profile">
						<div className="flex text-white items-center gap-1">
							<FaUserAlt />
							<span className="text-[#b7b7b7]">
								{user.addr.slice(0, 4) +
									"..." +
									user.addr.slice(-4)}
							</span>
						</div>

						<div
							className="logout-btn md:absolute"
							onClick={() => fcl.unauthenticate()}
						>
							Logout <FiLogOut />
						</div>
					</div>
				</Link>
			) : (
				<button
					className="px-3 rounded-[5px] border-2 border-[#025b4b] bg-[#00997d] box-border text-white "
					onClick={() => fcl.authenticate()}
				>
					Connect Wallet
				</button>
			)}
		</div>
	);
};

export default AuthBtn;
