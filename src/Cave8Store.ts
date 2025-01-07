import { create } from "zustand";

export interface Codes {
    code: string;
}

export interface Cave8OrderDetail {
    orderid: string;
    number: string;
    code: Codes[];
}

export interface Cave8State {
    orderdata: Cave8OrderDetail[];
}

const useCave8Store = create<Cave8State>((set)=> ({
    orderdata: []
}));

export default useCave8Store;