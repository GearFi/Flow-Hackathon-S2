// NOTE: I deployed this to 0x05 in the playground
import NonFungibleToken from 0x631e88ae7f1d7c20
import MyNFT from 0x63fbacb124806e4b
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868



pub contract NFTMarketplace {

  pub struct SaleItem {
    pub let price: UFix64
    
    pub let nftRef: &MyNFT.NFT
    
    init(_price: UFix64, _nftRef: &MyNFT.NFT) {
      self.price = _price
      self.nftRef = _nftRef
    }
  }

  pub resource interface SaleCollectionPublic {
    pub fun getIDs(): [UInt64]
    pub fun getPrice(id: UInt64): UFix64
    pub fun extraPurchase(id: UInt64, recipientAddress: Address, payment: @FlowToken.Vault)
  }

  pub resource SaleCollection: SaleCollectionPublic {
    // maps the id of the NFT --> the price of that NFT
    pub var forSale: {UInt64: UFix64}
    pub let MyNFTCollection: Capability<&MyNFT.Collection>
    pub let FlowTokenVault: Capability<&FlowToken.Vault>

    pub fun listForSale(id: UInt64, price: UFix64) {
      pre {
        price >= 0.0: "It doesn't make sense to list a token for less than 0.0"
        self.MyNFTCollection.borrow()!.getIDs().contains(id): "This SaleCollection owner does not have this NFT"
      }

      self.forSale[id] = price
    }

    pub fun unlistFromSale(id: UInt64) {
      self.forSale.remove(key: id)
    }

    // pub fun purchase(id: UInt64, recipientCollection: &MyNFT.Collection{NonFungibleToken.CollectionPublic}, payment: @FlowToken.Vault) {
    pub fun purchase(id: UInt64, recipientCollection: &MyNFT.Collection, payment: @FlowToken.Vault) {
      pre {
        payment.balance == self.forSale[id]: "The payment is not equal to the price of the NFT"
      }

      recipientCollection.deposit(token: <- self.MyNFTCollection.borrow()!.withdraw(withdrawID: id))
      self.FlowTokenVault.borrow()!.deposit(from: <- payment)
      self.unlistFromSale(id: id)
    }

    pub fun extraPurchase(id: UInt64, recipientAddress: Address, payment: @FlowToken.Vault){
      //check that only author can run this function...
      //put this 30% tokens in our own vault
      let amount: UFix64 = self.getPrice(id: id)
      self.FlowTokenVault.borrow()!.deposit(from: <- payment)
      //make a vault with 100% of the amount
      let completePayment: @FungibleToken.Vault <- self.FlowTokenVault.borrow()!.withdraw(amount: amount)
      let flowCompletePayment: @FlowToken.Vault <- completePayment as! @FlowToken.Vault
      //take out the NFT from the collection wherever it is stored :FungibleToken.Vault
      let recipientCollection: &MyNFT.Collection = self.MyNFTCollection.borrow()!
      
      self.purchase(id: id, recipientCollection: recipientCollection, payment: <- flowCompletePayment)

      //store that NFT in our own collection

      //create a mapping that the following user has sent that much money
    }

    pub fun getPrice(id: UInt64): UFix64 {
      return self.forSale[id]!
    }

    pub fun getIDs(): [UInt64] {
      return self.forSale.keys
    }

    init(_MyNFTCollection: Capability<&MyNFT.Collection>, _FlowTokenVault: Capability<&FlowToken.Vault>) {
      self.forSale = {}
      self.MyNFTCollection = _MyNFTCollection
      self.FlowTokenVault = _FlowTokenVault
    }
  }


  pub fun createSaleCollection(MyNFTCollection: Capability<&MyNFT.Collection>, FlowTokenVault: Capability<&FlowToken.Vault>): @SaleCollection {
    return <- create SaleCollection(_MyNFTCollection: MyNFTCollection, _FlowTokenVault: FlowTokenVault)
  }

  init() {

  }
}
