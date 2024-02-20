import { create } from "zustand";

export interface Codes {
    code: string;
}

export interface Cave2OrderDetail {
    orderid: string;
    number: string;
    code: Codes[];
}

export interface Cave2State {
    orderdata: Cave2OrderDetail[];
}

const useCave2Store = create<Cave2State>((set)=> ({
    orderdata: []
}));

export default useCave2Store;