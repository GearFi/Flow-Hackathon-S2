export const get_user_balance = `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
pub fun main(account: Address): UFix64 {
    
    let userVaultPublic = getAccount(account).getCapability(/public/flowTokenBalance)
            .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
            ??panic("unable to receive user vault balance")
    let balance: UFix64 = userVaultPublic.balance

    return balance
}
`;
