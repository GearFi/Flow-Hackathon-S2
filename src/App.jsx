import './App.css'
import { useState, useEffect } from 'react'
import { setupUserTx } from './cadence/transactions/setup_user'
import { mintNFT } from './cadence/transactions/mint_nft'
import Collection from "./Collection";

import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'

//import { create } from 'ipfs-http-client'
//const client = create('https://ipfs.infura.io:5001/api/v0')

fcl
  .config()
  .put('accessNode.api', 'https://access-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')

function App() {
  const [user, setUser] = useState()
  const [nameOfNFT, setNameOfNFT] = useState('')
  const [hash, setHash] = useState('')
  const [address, setAddress] = useState()
  const [officialAddress, setOfficialAddress] = useState('')

  useEffect(() => {
    fcl.currentUser().subscribe(setUser)
  }, [])

  const mint = async () => {
    try {
      //const added = await client.add(file)
      //const hash = added.path

      const transactionId = await fcl
        .send([
          fcl.transaction(mintNFT),
          fcl.args([fcl.arg(hash, t.String), fcl.arg(nameOfNFT, t.String)]),
          fcl.payer(fcl.authz),
          fcl.proposer(fcl.authz),
          fcl.authorizations([fcl.authz]),
          fcl.limit(9999),
        ])
        .then(fcl.decode)

      console.log(transactionId)
      return fcl.tx(transactionId).onceSealed()
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  const setupUser = async () => {
    console.log('setup')
    const transactionId = await fcl
      .send([
        fcl.transaction(setupUserTx),
        fcl.args([]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode)

    console.log(transactionId)
    return fcl.tx(transactionId).onceSealed()
  }

  return (
    <div>
      <h1>
        Account Address:
        {user && user.addr ? user.addr : ''}
      </h1>
      <button onClick={() => fcl.authenticate()}>LOG IN</button>
      <button onClick={() => fcl.unauthenticate()}>LOG OUT</button>
      <button onClick={() => setupUser()}>setup user</button>

      <hr />

      <div>
        <input type='text' onChange={(e) => setNameOfNFT(e.target.value)} />
        <input type='text' onChange={(e) => setHash(e.target.value)} />
        <button onClick={() => mint()}>Mint</button>
      </div>

      <hr />
      <div>
        <input type='text' onChange={(e) => setAddress(e.target.value)} />
        <button onClick={() => setOfficialAddress(address)}>Search</button>
      </div>
      <hr />
      {user && user.addr && officialAddress && officialAddress !== '' ? (
        <Collection address={officialAddress}></Collection>
      ) : null}
    </div>
  )
}

export default App

// Blockto
//flow address: 0xf53c92a16aac6b6f

//private key: 6ee48565778ff885d81c9f31f3ec04432e44f3570e576f071ea4f779be1653f4
//public keyy: 084d9dc52edd4c0cc09635df3b8481ab9b0e540a5ae0a0d7d1a6f0034a1d44cf3a0add038f4bacc2f0a045a09dd0e444d4d1ec2095ddb5b230c37081bff787fe
//address: 0xa488aa6b903b1202
//service account: 0xf8d6e0586b0a20c7

//------------------------
// Private Key              dc1d0a91856cda6180da553ac21a858a53ecd812ec3833a31b176bb7c1d8e432
// Public Key               7018274c3fc5859d798a95198fb97765e395dc9f6ad7c3e6d4d2f3e6985e0a0d15d5a0a1698de8d9d17468a25d9925ac46b8f7ebd19044e4364e0239d803a73c
// Address                  0x63fbacb124806e4b
