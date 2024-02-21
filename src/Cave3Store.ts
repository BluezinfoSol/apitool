import { create } from "zustand";

export interface Codes {
    code: string;
}

export interface Cave3OrderDetail {
    orderid: string;
    number: string;
    code: Codes[];
}

export interface Cave3State {
    orderdata: Cave3OrderDetail[];
}

const useCave3Store = create<Cave3State>((set)=> ({
    orderdata: []
}));

export default useCave3Store;