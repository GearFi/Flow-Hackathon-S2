export const depositStake = `
import FlowToken from 0x7e60df042a9c0868
import NFTMarketplace5 from 0x63fbacb124806e4b

transaction() {

    prepare(acct: AuthAccount) {
      
      let saleCollection = getAccount(0xf53c92a16aac6b6f).getCapability(/public/MySaleCollection11)
                          .borrow<&NFTMarketplace5.SaleCollection{NFTMarketplace5.SaleCollectionPublic}>()
                          ?? panic("Could not borrow the user's SaleCollection")
  
      let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: 12.0) as! @FlowToken.Vault

      saleCollection.depositStake(stakerAddress: 0x3edcc08611cde24c, payment: <- payment)
      depositStake(stakerAddress: Address, payment: @FlowToken.Vault)

      }
    execute {
      log("A user purchased an NFT")
    }
  }
`