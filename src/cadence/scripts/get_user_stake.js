export const get_user_stake = `
import NFTMarketplace5 from 0xdbc62aed64f62dea

pub fun main(account: Address): UFix64 {
    
    let saleCollection = getAccount(account).getCapability(/public/MySaleCollection14)
                        .borrow<&NFTMarketplace5.SaleCollection{NFTMarketplace5.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")
    let userStake = saleCollection.getTokensStaked(stakerAddress: account)
    return userStake
}
`