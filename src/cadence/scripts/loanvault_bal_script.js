export const loanvaultBalance = `
import MyNFT from 0x63fbacb124806e4b
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(): UFix64 {
  
  let saleCollection = getAccount(0xf53c92a16aac6b6f).getCapability(/public/NFTMarketplace8)
          .borrow<&NFTMarketplace5.SaleCollection{NFTMarketplace5.SaleCollectionPublic}>()
          ?? panic("Could not borrow the user's SaleCollection")
    let balance = saleCollection.getLoanVaultBalance(id: 1)
  return balance
}
`
