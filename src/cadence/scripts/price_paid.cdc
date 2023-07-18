import MyNFT from 0x63fbacb124806e4b
import NonFungibleToken from 0x631e88ae7f1d7c20
import NFTMarketplace4 from 0x63fbacb124806e4b

pub fun main(account: Address): {UInt64: NFTMarketplace4.SaleItem} {
  let saleCollection = getAccount(account).getCapability(/public/MySaleCollection7)
                        .borrow<&NFTMarketplace4.SaleCollection{NFTMarketplace4.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

  let collection = getAccount(account).getCapability(/public/MyNFTCollection)
                    .borrow<&MyNFT.Collection{NonFungibleToken.CollectionPublic, MyNFT.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let saleIDs = saleCollection.getIDs()

  let returnVals: {UInt64: NFTMarketplace4.SaleItem} = {}

  for saleID in saleIDs {
    let price = saleCollection.getPrice(id: saleID)
    let ` = collection.borrowEntireNFT(id: saleID)

    returnVals.insert(key: nftRef.id, NFTMarketplace4.SaleItem(_price: price, _nftRef: nftRef))
  }


  return returnVals
}