export interface fwv_int{
    createPayment: (obj: {email: string, amount: number, subaccount: string, currency: string})=>Promise<string>
    createSubaccount: (obj: {account_name: string, email: string, mobilenumber: string, country: string})=> Promise<string>
    getSubaccount: (ref: string)=>Promise<subaccount_int>
    updateSubaccount: (ref: string, update: {account_name: string, mobilenumber: string, email: string, country: string})=>Promise<subaccount_int>
    getTransactions: (ref: string, currency: string, from?: string, to?: string)=>Promise<fetch_transaction_res>
    getBalance: (ref: string)=>Promise<fetch_balance_res>
}

export interface subaccount_int{
    id: string,
    account_reference: string
    email: string
    mobilenumber: string
    country: string
    bank_name: string
    bank_code: string
    status: string
    created_at: string
}

export interface transaction_int{
    type: string
    amount: string
    currency: string
    balance_before: number
    balance_after: number
    reference: string
    date: string
    remarks: string
    sent_amount: string
    statement_type: string
}

export interface fetch_transaction_res{
    total: number, current_page: number,total_pages: number, transactions:transaction_int[]
}

export interface fetch_balance_res{
    available_balance: number, ledger_balance: number, currency: string
}