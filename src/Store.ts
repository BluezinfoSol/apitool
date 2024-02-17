import { create } from "zustand";

export interface OrderDetail {
    orderid: string;
    number: string;
    code: string;
}

export interface CaveState {
    orderdata: OrderDetail[];
}

const useCaveStore = create<CaveState>((set)=> ({
    orderdata: []
}));

export default useCaveStore;