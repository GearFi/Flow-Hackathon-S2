export const unlistFromSaleTx = `
import NFTMarketplace5 from 0xdbc62aed64f62dea

transaction(id: UInt64) {

  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&NFTMarketplace5.SaleCollection>(from: /storage/MySaleCollection14)
                            ?? panic("This SaleCollection does not exist")

    saleCollection.unlistFromSale(id: id)
  }

  execute {
    log("A user unlisted an NFT for Sale")
  }
}

`;
