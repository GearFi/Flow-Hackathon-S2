import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index";
import Navbar from "./inc/Navbar/Navbar";

import Home from "./Components/Home/Home";

import * as fcl from "@onflow/fcl";
import Profile from "./Components/Profile/Profile";

fcl.config()
	.put("accessNode.api", "https://access-testnet.onflow.org")
	.put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");

function App() {
	return (
		<div className="min-h-screen bg-[#0f0e13] bg-[radial-gradient(at_0_0,#100f15_0,transparent_50%),radial-gradient(at_50%_0,#2f3e6a_0,transparent_50%),radial-gradient(at_100%,#722741_0,transparent_50%)]">
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path="/">
						<Route index element={<Home />} />

						<Route path="profile">
							<Route index element={<Profile />} />
							<Route path=":addr" element={<Profile />} />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
