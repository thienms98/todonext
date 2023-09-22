import axios from "axios";

export async function fetchData({path, method='get', data, accessToken}: {path: string, method?:string, data?: {}, accessToken?: string}){
  try{
    return await axios({
    url: `${process.env.NEXT_PUBLIC_API_URL}/${path}`,
    method,
    data,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })}catch(err){
    console.log(err)
  }
}