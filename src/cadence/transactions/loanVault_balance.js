export const loanVault_balance = `
import MyNFT from 0x63fbacb124806e4b
import NonFungibleToken from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import NFTMarketplace4 from 0x63fbacb124806e4b

transaction {
  prepare(acct: AuthAccount) {

    let balance = acct
              .borrow<&FlowToken.Vault>(/private/LoanVault21)
              ??panic("balance not accessible")
              log("balance")
    log(balance)
  }

  execute {
    
  }
}
`