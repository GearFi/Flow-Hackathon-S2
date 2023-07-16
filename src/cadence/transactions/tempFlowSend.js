export const tempFlowSend = `
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

transaction {
    prepare(acct: AuthAccount) {
      
      let flowTokenVaultRef = acct.getCapability<&FlowToken.Vault>(/storage/flowTokenVault)
                            .borrow()
                            ?? panic("Could not borrow reference to FlowToken.Vault")
                            
      let payment <- flowTokenVaultRef.withdraw(amount: 10.0)
  
      destroy payment
      
    }
  
    execute {
      log("A user stored a Collection and a SaleCollection inside their account")
    }
  }
`
