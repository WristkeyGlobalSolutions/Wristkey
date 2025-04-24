// Financial Institution Variable

// To facilitate financial operations like loans, we define a structure for financial institutions.

// rust

struct FinancialInstitution {
    name: String,
    available_funds: u64,
}

impl FinancialInstitution {
    fn approve_loan(&self, amount: u64) -> bool {
        if self.available_funds >= amount {
            true
        } else {
            false
        }
    }
}