export interface paystack_int{
    checkout: (obj: {email: string, amount: number})=>Promise<string>
    verifyPayment: (ref: string)=>Promise<{status: boolean}>
    verifyAccount: (obj:{account_number: string, bank_code: string}) =>Promise<{status: boolean, data: account_info}>
    createRecipient: (obj: {name: string, account_number: string, bank_code: string})=>Promise<{status: boolean, data: recipient}>
    createTransfer: (obj: {source: string, reason: string, amount: number, reference: string, recipient: string})=>Promise<transfer_int>
    listBanks: ()=>Promise<bank[]>
}

export interface account_info {
        account_name: string
        account_number: string
        bank_id: number
    }

export interface recipient{
        currency: string
        recipient_code: string
        details: account_info
    }

export interface transfer_int{
    status: string,
    data: {
        amount: number
        currency: string
        id: number
    }
    transfer_code: string
    source: string
    reference: string
    reason: string
}

export interface bank{
    name: string
    slug: string
    code: number
    country: string
    type: string
}



