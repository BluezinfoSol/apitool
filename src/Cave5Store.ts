import { create } from "zustand";

export interface Codes {
    code: string;
}

export interface Cave5OrderDetail {
    orderid: string;
    number: string;
    code: Codes[];
}

export interface Cave5State {
    orderdata: Cave5OrderDetail[];
}

const useCave5Store = create<Cave5State>((set)=> ({
    orderdata: []
}));

export default useCave5Store;