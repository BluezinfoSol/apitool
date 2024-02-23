import { create } from "zustand";

export interface Codes {
    code: string;
}

export interface Cave4OrderDetail {
    orderid: string;
    number: string;
    code: Codes[];
}

export interface Cave4State {
    orderdata: Cave4OrderDetail[];
}

const useCave4Store = create<Cave4State>((set)=> ({
    orderdata: []
}));

export default useCave4Store;