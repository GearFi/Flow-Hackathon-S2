import './App.css'

import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'
import { useState, useEffect } from 'react'
import { getNFTsScript } from './cadence/scripts/get_nfts.js'

export default function Collection(props) {
  const [nfts, setNFTs] = useState([])

  useEffect(() => {
    getUserNFTs()
  }, [])

    const getUserNFTs = async () => {
        const result = await fcl.send([
            fcl.script(`pub fun main(message: Address): Address {
                return message
              }`),
            fcl.args([
                fcl.arg(props.address, t.Address)
            ])
        ]).then(fcl.decode);

        console.log(result);
        setNFTs(result);
    }

//   const getUserNFTs = async () => {
//     const response = await fcl.query({
//       cadence: `
//       import MyNFT from 0x63fbacb124806e4b
//       import NonFungibleToken from 0x631e88ae7f1d7c20

//       pub fun main(account: Address): Address {
        
//                 return message
//               }`, // CADENCE CODE GOES IN THESE ``
//       args: (arg, t) => [fcl.arg(props.address, t.Address)], // ARGUMENTS GO IN HERE
//     })

//     console.log('Response from our script: ' + response)
//   }

  return (
    <div style={{ backgroundColor: 'lightgreen' }}>
      {nfts.map((nft) => (
        <div key={nft.id}>
          <h1>{nft.id}</h1>
          <img
            style={{ width: '100px' }}
            src={`https://ipfs.io/ipfs/${nft.ipfsHash}`}
          />
          <h1>{nft.metadata.name}</h1>
        </div>
      ))}
    </div>
  )
}
