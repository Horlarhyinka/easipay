export const minAmount = 500

export const getCurrency = (country: string):string | undefined =>{
    const country_currency_map = {
        "NG": "NG",
        /** finish this later **/
    }
    country = country.toUpperCase()
    return country_currency_map[country as keyof typeof country_currency_map]
}

export enum transaction_types{
    payment="payment",
    withdrawal="withdrawal"
}

export const default_payment_description = "EASIPAY CHECKOUT"
export const default_payment_source = "balance"
export const checkout_path = "/api/v1/payments/pay"