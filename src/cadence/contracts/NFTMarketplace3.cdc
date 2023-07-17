
import NonFungibleToken from 0x631e88ae7f1d7c20
import MyNFT from 0x63fbacb124806e4b
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868


pub contract NFTMarketplace3 {

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
    pub var nftLoans : {UInt64: NFTMarketplace3.LoanRecord}
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

    pub fun purchase(id: UInt64, recipientCollection: &MyNFT.Collection, payment: @FlowToken.Vault) {
      pre {
        payment.balance == self.forSale[id]: "The payment is not equal to the price of the NFT"
      }

      //   //recipientCollection.deposit(token: <- self.MyNFTCollection.borrow()!.withdraw(withdrawID: id))

      let nft <- self.MyNFTCollection.borrow()!.withdraw(withdrawID: id)  

      getAccount(0xf53c92a16aac6b6f).getCapability(/public/MyNFTCollection)
            .borrow<&MyNFT.Collection{MyNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>()!
            .deposit(token: <- nft)
      self.UserFlowVault.borrow()!.deposit(from: <- payment)
      self.unlistFromSale(id: id)
    }

    pub fun extraPurchase(id: UInt64, recipientAddress: Address, payment: @FlowToken.Vault, seller: Address){
      //get the Salecollectionpublic of the seller: 
      let saleCollection = getAccount(seller).getCapability(/public/MySaleCollection5)
                        .borrow<&NFTMarketplace3.SaleCollection{NFTMarketplace3.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

      //check that only author can run this function...
      let amount: UFix64 = saleCollection.getPrice(id: id)
      let downPayment: UFix64 = payment.balance   

      let recipientCollection: &MyNFT.Collection = self.MyNFTCollection.borrow()!

      if(amount == downPayment){
        self.purchase(id: id, recipientCollection: recipientCollection, payment: <- payment)
      }
      else{
        //put 30% tokens in our own vault
        self.FlowTokenVault.borrow()!.deposit(from: <- payment)
        //make a vault with 100% of the amount
        let completePayment: @FungibleToken.Vault <- self.FlowTokenVault.borrow()!.withdraw(amount: amount)
        let flowCompletePayment: @FlowToken.Vault <- completePayment as! @FlowToken.Vault
        
        //create a mapping that the following user has sent that much money
        self.nftLoans[id] = NFTMarketplace3.LoanRecord(_ownerAddress: recipientAddress, _nftPrice: amount, _loanState: 1, pricePaid: downPayment)

        //take out the NFT from the collection wherever it is stored :FungibleToken.Vault
        saleCollection.extraPurchase(id: id, recipientAddress: recipientAddress, payment: <-flowCompletePayment, seller: seller)
      }
      
      //store that NFT in our own collection


      //LoanStates
      // 1-->LoanActive

    }

    pub fun getPrice(id: UInt64): UFix64 {
      return self.forSale[id]!
    }

    pub fun getIDs(): [UInt64] {
      return self.forSale.keys
    }

    init(_MyNFTCollection: Capability<&MyNFT.Collection>, _FlowTokenVault: Capability<&FlowToken.Vault>, _UserFlowVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>) {
      self.forSale = {}
      self.nftLoans = {}
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