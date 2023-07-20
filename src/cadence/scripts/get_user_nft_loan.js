export const get_user_nft_loan = `
import NFTMarketplace5 from 0xdbc62aed64f62dea

pub fun main(nftId: UInt64): UFix64 {
    
    let saleCollection = getAccount(0xf53c92a16aac6b6f).getCapability(/public/MySaleCollection14)
                        .borrow<&NFTMarketplace5.SaleCollection{NFTMarketplace5.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")
    let remainingLoan: UFix64 = saleCollection.getRemainingLoan(nftId: nftId)
    return remainingLoan
}
`