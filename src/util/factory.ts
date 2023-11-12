export const minAmount = 500

export const getCurrency = (country: string):string | undefined =>{
    const country_currency_map = {
        "NIGERIA": "NG",
        /** finish this later **/
    }
    country = country.toUpperCase()
    return country_currency_map[country]
}