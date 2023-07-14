export const mintScript = `
import FlowToken from 0x63fbacb124806e4b
import FungibleToken from 0x9a0766d93b6608b7

    transaction(amount: UFix64, address: Address) {

        prepare(acct: AuthAccount) {
          let admin = acct.borrow<FlowToken.Administrator>(from: /storage/flowTokenAdmin).panic("Unable to fetch admmin data")


          let minter = admin.createNewMinter(allowedAmount: amount)
          let funds = minter.mintTokens(amount: amount) 
      
          let recipientVault = getAccount(address).getCapability(/public/flowTokenReceiver)
                           .borrow<&FlowToken.Vault{FungibleToken.Receiver}>()
                           ?? panic("recipient not valid")
            recepientVault.borrow().deposit(from: <- funds)
        }
      
        execute {
          log("A user minted an NFT into their account")
        }
      }
`