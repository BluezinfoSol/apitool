import { create } from "zustand";

export interface Codes {
    code: string;
}

export interface Cave7OrderDetail {
    orderid: string;
    number: string;
    code: Codes[];
}

export interface Cave7State {
    orderdata: Cave7OrderDetail[];
}

const useCave7Store = create<Cave7State>((set)=> ({
    orderdata: []
}));

export default useCave7Store;