import axios from "axios"

export const axiosInstance = axios.create({});
export const apiConnector = (method,url,header,bodyData,params)=>{
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        headers:header?header:null,
        data:bodyData?bodyData:null,
        params:params?params:null,
        withCredentials: true
    });
}