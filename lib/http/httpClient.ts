import axios from "axios";

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

const fetcher = (url: string) => httpClient.get(url).then((res) => res.data);
const fetcherWithToken = ([url, token]: [string, string]) =>
  httpClient
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data);

export { httpClient, fetcher, fetcherWithToken };
