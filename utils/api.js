import { API_URL, STRAPI_API_TOKEN } from "./urls";


export const fetchDataFromApi = async (endPoint) => {

    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'insomnia/2023.5.8',
            Authorization: 'Bearer ' + STRAPI_API_TOKEN
        }
    };


    const res = await fetch(`${API_URL}${endPoint}`, options);
    const data = await res.json();


    return data;
}

export const makePaymentRequest = async (endPoint, payload) => {
    const res = await fetch(`${API_URL}${endPoint}`, {
        method: 'POST',
        headers: {
            'User-Agent': 'insomnia/2023.5.8',
            Authorization: 'Bearer ' + STRAPI_API_TOKEN,
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(payload)
    })

    const data = await res.json()
    return  data;
}

