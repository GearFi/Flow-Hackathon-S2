export const getSaleNFTsScript = `
import MyNFT from 0x63fbacb124806e4b
import NonFungibleToken from 0x631e88ae7f1d7c20
import NFTMarketplace5 from 0xdbc62aed64f62dea

pub fun main(account: Address): {UInt64: NFTMarketplace5.SaleItem} {
  let saleCollection = getAccount(account).getCapability(/public/MySaleCollection14)
                        .borrow<&NFTMarketplace5.SaleCollection{NFTMarketplace5.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

  let collection = getAccount(account).getCapability(/public/MyNFTCollection)
                    .borrow<&MyNFT.Collection{NonFungibleToken.CollectionPublic, MyNFT.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let saleIDs = saleCollection.getIDs()

  let returnVals: {UInt64: NFTMarketplace5.SaleItem} = {}

  for saleID in saleIDs {
    let price = saleCollection.getPrice(id: saleID)
    let nftRef = collection.borrowEntireNFT(id: saleID)

    returnVals.insert(key: nftRef.id, NFTMarketplace5.SaleItem(_price: price, _nftRef: nftRef))
  }


  return returnVals
}
`