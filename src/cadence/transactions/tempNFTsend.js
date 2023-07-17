export const tempNFTsend = `
import MyNFT from 0x63fbacb124806e4b
import NonFungibleToken from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import NFTMarketplace3 from 0x63fbacb124806e4b

transaction {
    prepare(acct: AuthAccount) {
  
      let MyNFTCollection: Capability<&MyNFT.Collection> = acct.getCapability<&MyNFT.Collection>(/private/MyNFTCollection)
      
      let nft <- MyNFTCollection.borrow()!.withdraw(withdrawID: 2)
  
  
  
      getAccount(0x02deabac75a16f74).getCapability(/public/MyNFTCollection)
            .borrow<&MyNFT.Collection{MyNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>()!
            .deposit(token: <- nft)
  
      }
  
    execute {
      log("A user stored a Collection and a SaleCollection inside their account")
    }
  }
  
`
