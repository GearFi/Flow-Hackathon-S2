export const claim_nft = `
import NFTMarketplace5 from 0xdbc62aed64f62dea

transaction(id: UInt64) {

    prepare(acct: AuthAccount) {
      let saleCollection = getAccount(0xf53c92a16aac6b6f).getCapability(/public/MySaleCollection14)
                          .borrow<&NFTMarketplace5.SaleCollection{NFTMarketplace5.SaleCollectionPublic}>()
                          ?? panic("Could not borrow the user's SaleCollection")
      saleCollection.claimNFT(nftId: id)
    }
  
    execute {
      log("A user claimed his nft")
    }
  }
`