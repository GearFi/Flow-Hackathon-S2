export const listForSaleTx = `
import NFTMarketplace2 from 0x63fbacb124806e4b

transaction(id: UInt64, price: UFix64) {

  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&NFTMarketplace2.SaleCollection>(from: /storage/MySaleCollection4)
                            ?? panic("This SaleCollection does not exist")

    saleCollection.listForSale(id: id, price: price)
  }

  execute {
    log("A user listed an NFT for Sale")
  }
}
`