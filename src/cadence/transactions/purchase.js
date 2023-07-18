const mySaleCollection = "MySaleCollection7"

export const purchaseTx = `
import MyNFT from 0x63fbacb124806e4b
import NonFungibleToken from 0x631e88ae7f1d7c20
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import NFTMarketplace4 from 0x63fbacb124806e4b

transaction(account: Address, id: UInt64) {

  prepare(acct: AuthAccount) {
    let saleCollection = getAccount(0xf53c92a16aac6b6f).getCapability(/public/${mySaleCollection})
                        .borrow<&NFTMarketplace4.SaleCollection{NFTMarketplace4.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")


    let sellerCollection = getAccount(account).getCapability(/public/${mySaleCollection})
                        .borrow<&NFTMarketplace4.SaleCollection{NFTMarketplace4.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

    let price: UFix64 = sellerCollection.getPrice(id: id)
    let downPayment: UFix64 = price * 0.3

    let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: downPayment) as! @FlowToken.Vault


    //Don't call this purchase, instead call the extrapurchase from the address: 0x63bacb124806e4b
    saleCollection.extraPurchase(id: id, recipientAddress: acct.address, payment: <-payment, seller: account)
  }

  execute {
    log("A user purchased an NFT")
  }
}
`