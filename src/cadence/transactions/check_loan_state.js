export const check_loan_state = `
import MyNFT from 0x63fbacb124806e4b
import NonFungibleToken from 0x631e88ae7f1d7c20
import NFTMarketplace4 from 0x63fbacb124806e4b

pub fun main(acct: AuthAccount): NFTMarketplace4.LoanState? {
    //   let collection = acct.getCapability<&FlowToken.Vault>(/private/LoanVault3)
    //                     .borrow()
    //                     ?? panic("Can't get the User's loan vault.")
    
        let saleCollection = acct.getCapability(/private/MySaleCollection7)
                            .borrow<&NFTMarketplace4.SaleCollection>()
                            ?? panic("Could not borrow the user's SaleCollection")  
    
        return saleCollection.nftLoans[6]?.state
    
    }
`
