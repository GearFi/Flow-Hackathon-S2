export const unlistFromSaleTx = `
import NFTMarketplace4 from 0x63fbacb124806e4b

transaction(id: UInt64) {

  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&NFTMarketplace4.SaleCollection>(from: /storage/MySaleCollection7)
                            ?? panic("This SaleCollection does not exist")

    saleCollection.unlistFromSale(id: id)
  }

  execute {
    log("A user unlisted an NFT for Sale")
  }
}

`
