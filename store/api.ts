import axios, {AxiosAdapter, AxiosResponse} from "axios";

export interface ColorType {
    "value": string | null;
}

export interface ColorResponse {
    "colors": ColorType[]
}

export const noopURI = "https://api.noopschallenge.com";
export const hexBotEndPoint = "/hexbot";

export const noopAPI = axios.create({
    baseURL: noopURI,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    responseType: 'json'
});

export interface MockData {
    color: string | null;
    waitTime?: number;
}

export const mockAdapterCreator: (data: MockData) => AxiosAdapter
    = data => async config => {

    const initializer: Required<MockData> = {
        ...{
            color: null,
            waitTime: 0
        }, ...data
    };

    //タイマー
    await new Promise(resolve => setTimeout(resolve, initializer.waitTime));

    const mockData: ColorResponse = {
        colors: [{
            value: initializer.color
        }]
    };

    const response: AxiosResponse = {
        data: mockData,
        status: 200,
        statusText: "",
        headers: "",
        config: config,
    };

    return response;
};