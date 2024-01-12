export interface transfer_int{
    initiate_transfer: ()=>Promise<string>
    complete_transfer: ()=>Promise<any>
}

export interface transfer{
    status: string
    amount: number
    currency: string
    reason: string
    transfer_code: string

}