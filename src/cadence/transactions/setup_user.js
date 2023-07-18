
const mySaleCollection = "MySaleCollection11"

export const setupUserTx = `
import MyNFT from 0x63fbacb124806e4b
import NonFungibleToken from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import NFTMarketplace5 from 0x63fbacb124806e4b

transaction {
  prepare(acct: AuthAccount) {

    acct.save(<- MyNFT.createEmptyCollection(), to: /storage/MyNFTCollection3)
    acct.save(<- FlowToken.createEmptyVault(), to: /storage/LoanVault7)

    acct.link<&MyNFT.Collection{MyNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/MyNFTCollection3, target: /storage/MyNFTCollection3)
    acct.link<&MyNFT.Collection>(/private/MyNFTCollection3, target: /storage/MyNFTCollection3)
    acct.link<&FlowToken.Vault>(/private/LoanVault7, target: /storage/LoanVault7)

    let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: UFix64(300)) as! @FlowToken.Vault

    let MyNFTCollection3: Capability<&MyNFT.Collection> = acct.getCapability<&MyNFT.Collection>(/private/MyNFTCollection3)
    let FlowTokenVault: Capability<&FlowToken.Vault> = acct.getCapability<&FlowToken.Vault>(/private/LoanVault7)
    let UserFlowVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)

    acct.link<&FlowToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>(/public/LoanVault7, target: /storage/LoanVault7)

    FlowTokenVault.borrow()!.deposit(from: <- payment)

    acct.save(<- NFTMarketplace5.createSaleCollection(MyNFTCollection: MyNFTCollection3, FlowTokenVault: FlowTokenVault, UserFlowVault: UserFlowVault), to: /storage/${mySaleCollection})

    acct.link<&NFTMarketplace5.SaleCollection{NFTMarketplace5.SaleCollectionPublic}>(/public/${mySaleCollection}, target: /storage/${mySaleCollection})
  }

  execute {
    log("A user stored a Collection and a SaleCollection inside their account")
  }
}
`
