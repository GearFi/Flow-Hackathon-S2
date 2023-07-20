const mySaleCollection = "MySaleCollection14"

export const listForSaleTx = `
import NFTMarketplace5 from 0xdbc62aed64f62dea

transaction(id: UInt64, price: UFix64) {

  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&NFTMarketplace5.SaleCollection>(from: /storage/${mySaleCollection})
                            ?? panic("This SaleCollection does not exist")
  
    saleCollection.listForSale(id: id, price: price)
  }

  execute {
    log("A user listed an NFT for Sale")
  }
}
`