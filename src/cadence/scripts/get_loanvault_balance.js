export const get_loanvault_balance = `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
pub fun main(): UFix64 {
    
    let userVaultPublic = getAccount(0xf53c92a16aac6b6f).getCapability(/public/LoanVault9)
            .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
            ??panic("unable to receive user vault balance")
    let balance: UFix64 = userVaultPublic.balance

    return balance
}
`