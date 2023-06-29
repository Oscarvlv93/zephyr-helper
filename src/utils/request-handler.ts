import axios from 'axios'

interface response{
    status: number,
    message: any
}

async function postRequest(body: any, url: string, api_key: string): Promise<response> {
    try {

        const headers = {
            'Authorization': `Bearer ${api_key}`,
            'Content-Type': 'application/json',
        }

        const request = await axios.post(`https://api.zephyrscale.smartbear.com/v2/${url}`, body, { headers })
        
        return { status: request.status, message: request.data }

    } catch (error) {
        
        return { status: 500, message: error }
    }

}

async function getRequest(url: string, apiKey: string, params: any[]): Promise<response> {
    try {

        const queryString = '?' + params.join('&');
     
        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        }

        const request = await axios.get(`https://api.zephyrscale.smartbear.com/v2/${url}${queryString}`, { headers })
        
        return { status: request.status, message: request.data }

    } catch (error) {
        
        return { status: 500, message: error }
    }

}

export {postRequest, getRequest}