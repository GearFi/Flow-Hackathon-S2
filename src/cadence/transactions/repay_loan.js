export const repayLoanTx = `
import MyNFT from 0x63fbacb124806e4b
import FlowToken from 0x7e60df042a9c0868
import NFTMarketplace4 from 0x63fbacb124806e4b

transaction(nftId:UInt64, amount:UFix64) {
    prepare(acct: AuthAccount) {

      let saleCollection = getAccount(0xf53c92a16aac6b6f).getCapability(/public/MySaleCollection7)
                          .borrow<&NFTMarketplace4.SaleCollection{NFTMarketplace4.SaleCollectionPublic}>()
                          ?? panic("Could not borrow the user's SaleCollection")
      let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: amount) as! @FlowToken.Vault
  
      saleCollection.repayLoan(nftId: nftId, buyerAddress: acct.address, payment: <- payment, seller: 0x02deabac75a16f74)

      }
  
    execute {
      log("A user stored a Collection and a SaleCollection inside their account")
    }
  }
`;
