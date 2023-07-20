export const depositStake = `
import FlowToken from 0x7e60df042a9c0868
import NFTMarketplace5 from 0xdbc62aed64f62dea

transaction(amount: UFix64) {

  prepare(acct: AuthAccount) {
    
    let saleCollection = getAccount(0xf53c92a16aac6b6f).getCapability(/public/MySaleCollection14)
                        .borrow<&NFTMarketplace5.SaleCollection{NFTMarketplace5.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

    let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: amount) as! @FlowToken.Vault

    saleCollection.depositStake(stakerAddress: acct.address, payment: <- payment)

    }
  execute {
    log("A user purchased an NFT")
  }
}


`