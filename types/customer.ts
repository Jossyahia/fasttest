// types/customer.ts
export  interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "RETAIL" | "WHOLESALE" | "THIRDPARTY";
  address: string;
}
