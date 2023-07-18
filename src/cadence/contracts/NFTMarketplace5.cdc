
import NonFungibleToken from 0x631e88ae7f1d7c20
import MyNFT from 0x63fbacb124806e4b
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868



pub contract NFTMarketplace5 {

  pub struct SaleItem {
    pub let price: UFix64
    
    pub let nftRef: &MyNFT.NFT
    
    init(_price: UFix64, _nftRef: &MyNFT.NFT) {
      self.price = _price
      self.nftRef = _nftRef
    }
  }

  pub enum LoanState: UInt8 {
        pub case LoanCreated
        pub case LoanActive
        pub case LoanRepaid
        pub case NftClaimed
    }
  pub struct LoanRecord {
    pub let ownerAddress: Address
    pub let nftPrice: UFix64
    pub(set) var state: LoanState
    pub(set) var pricePaid: UFix64

    pub fun changeState(_state: LoanState){
      self.state = _state
    }

    pub fun addPricePaid(_amount: UFix64){
      self.pricePaid = self.pricePaid + _amount
    }

    init(_ownerAddress: Address, _nftPrice: UFix64, _loanState: LoanState, _pricePaid: UFix64){
      self.ownerAddress = _ownerAddress
      self.nftPrice = _nftPrice
      self.pricePaid = _pricePaid
      self.state = _loanState
    }
  }


  pub resource interface SaleCollectionPublic {
    pub fun getIDs(): [UInt64]
    pub fun getPrice(id: UInt64): UFix64
    pub fun getLoanVaultBalance(id: UInt64): UFix64
    pub fun extraPurchase(id: UInt64, recipientAddress: Address, payment: @FlowToken.Vault, seller: Address)
    pub fun repayLoan(nftId: UInt64, buyerAddress: Address, payment: @FlowToken.Vault, seller: Address)
    pub fun claimNFT(nftId: UInt64)
    pub fun depositStake(stakerAddress: Address, payment: @FlowToken.Vault)
    pub fun withdrawStake(stakerAddress: Address, amount: UFix64) 
  }

  pub resource SaleCollection: SaleCollectionPublic {
    pub var forSale: {UInt64: UFix64}
    pub var nftLoans : {UInt64: NFTMarketplace5.LoanRecord}
    pub var deposits : {Address: UFix64}
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
      let saleCollection = getAccount(seller).getCapability(/public/MySaleCollection7)
                        .borrow<&NFTMarketplace5.SaleCollection{NFTMarketplace5.SaleCollectionPublic}>()
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
        self.nftLoans[id] = NFTMarketplace5.LoanRecord(_ownerAddress: recipientAddress, _nftPrice: amount, _loanState: LoanState.LoanActive, pricePaid: downPayment)
        //self.nftLoans[id]?[recipientAddress] :  amount

        //take out the NFT from the collection wherever it is stored :FungibleToken.Vault
        saleCollection.extraPurchase(id: id, recipientAddress: recipientAddress, payment: <-flowCompletePayment, seller: seller)
      }

    }

    pub fun repayLoan(nftId: UInt64, buyerAddress: Address, payment: @FlowToken.Vault, seller: Address){
      pre{
        payment.balance  >= 0.0: "Some tokens must be sent for repayment"
        self.nftLoans[nftId]?.pricePaid != 0.0: "downpayment not done for this nft"
      }

      let repayment: UFix64 = payment.balance
      self.FlowTokenVault.borrow()!.deposit(from: <- payment)
      let loanStruct: NFTMarketplace5.LoanRecord? = self.nftLoans[nftId]
      loanStruct?.addPricePaid(_amount: repayment)

      if(loanStruct?.nftPrice! <= loanStruct?.pricePaid!){
        loanStruct?.changeState(_state: LoanState.LoanRepaid) 
      }
    }

    pub fun claimNFT(nftId: UInt64){
      pre{
        false: log(self.nftLoans[nftId]?.state)?
        self.nftLoans[nftId]?.state == LoanState.LoanRepaid
      }

      let nft: @NonFungibleToken.NFT <- self.MyNFTCollection.borrow()!.withdraw(withdrawID: nftId)  
      
      let buyerAccount = self.nftLoans[nftId]?.ownerAddress!
      getAccount(buyerAccount).getCapability(/public/MyNFTCollection)
            .borrow<&MyNFT.Collection{MyNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>()!
            .deposit(token: <- nft)
    }

    pub fun depositStake(stakerAddress: Address, payment: @FlowToken.Vault){
      let stakeAmount: UFix64 = payment.balance
      self.FlowTokenVault.borrow()!.deposit(from: <- payment)
      self.deposits[stakerAddress] = self.deposits[stakerAddress]! + stakeAmount
    }

    pub fun withdrawStake(stakerAddress: Address, amount: UFix64) {
      pre{
        self.deposits[stakerAddress]! >= amount: "you don't have sufficient balance to withdraw"
      }
      self.deposits[stakerAddress] = self.deposits[stakerAddress]! - amount
      let completePayment: @FungibleToken.Vault <- self.FlowTokenVault.borrow()!.withdraw(amount: amount)
      let flowCompletePayment: @FlowToken.Vault <- completePayment as! @FlowToken.Vault
      getAccount(stakerAddress)
            .getCapability(/public/flowTokenReceiver)
            .borrow<&FlowToken.Vault{FungibleToken.Receiver}>()!.deposit(from: <- flowCompletePayment)
    }


    pub fun getPrice(id: UInt64): UFix64 {
      return self.forSale[id]!
    }

    pub fun getLoanVaultBalance(): UFix64{
        return self.FlowTokenVault.borrow()!.balance
    }

    pub fun getIDs(): [UInt64] {
      return self.forSale.keys
    }

    init(_MyNFTCollection: Capability<&MyNFT.Collection>, _FlowTokenVault: Capability<&FlowToken.Vault>, _UserFlowVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>) {
      self.forSale = {}
      self.nftLoans = {}
      self.deposits = {}
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



