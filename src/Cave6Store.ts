import { create } from "zustand";

export interface Codes {
    code: string;
}

export interface Cave6OrderDetail {
    orderid: string;
    number: string;
    code: Codes[];
}

export interface Cave6State {
    orderdata: Cave6OrderDetail[];
}

const useCave6Store = create<Cave6State>((set)=> ({
    orderdata: []
}));

export default useCave6Store;