export const setupUserTx = `
import MyNFT from 0x63fbacb124806e4b
import NonFungibleToken from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import NFTMarketplace2 from 0x63fbacb124806e4b

transaction {
  prepare(acct: AuthAccount) {

    //acct.save(<- MyNFT.createEmptyCollection(), to: /storage/MyNFTCollection)
    acct.save(<- FlowToken.createEmptyVault(), to: /storage/LoanVault)

    //acct.link<&MyNFT.Collection{MyNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/MyNFTCollection, target: /storage/MyNFTCollection)
    //acct.link<&MyNFT.Collection>(/private/MyNFTCollection, target: /storage/MyNFTCollection)
    acct.link<&FlowToken.Vault>(/private/LoanVault, target: /storage/LoanVault)

    let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: UFix64(900)) as! @FlowToken.Vault

    
    let MyNFTCollection: Capability<&MyNFT.Collection> = acct.getCapability<&MyNFT.Collection>(/private/MyNFTCollection)
    let FlowTokenVault: Capability<&FlowToken.Vault> = acct.getCapability<&FlowToken.Vault>(/private/LoanVault)

    FlowTokenVault.borrow()!.deposit(from: <- payment)

    acct.save(<- NFTMarketplace2.createSaleCollection(MyNFTCollection: MyNFTCollection, FlowTokenVault: FlowTokenVault), to: /storage/MySaleCollection4)

    acct.link<&NFTMarketplace2.SaleCollection{NFTMarketplace2.SaleCollectionPublic}>(/public/MySaleCollection4, target: /storage/MySaleCollection4)
  }

  execute {
    log("A user stored a Collection and a SaleCollection inside their account")
  }
}
`