export const claim_nft = `
import NFTMarketplace4 from 0x63fbacb124806e4b

transaction(id: UInt64) {

    prepare(acct: AuthAccount) {
      let saleCollection = getAccount(0xf53c92a16aac6b6f).getCapability(/public/MySaleCollection7)
                          .borrow<&NFTMarketplace4.SaleCollection{NFTMarketplace4.SaleCollectionPublic}>()
                          ?? panic("Could not borrow the user's SaleCollection")
      saleCollection.claimNFT(nftId: id)
    }
  
    execute {
      log("A user claimed his nft")
    }
  }
`