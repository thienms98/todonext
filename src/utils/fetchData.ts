import axios from "axios";

export async function fetchData(path: string, params: any = {method: 'get'}){
  const baseUrl = 'http://localhost:3000'
  return await axios(`{${baseUrl}/api/${path}}`, { ...params })
}