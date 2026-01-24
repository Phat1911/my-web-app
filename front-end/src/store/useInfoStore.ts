import { create } from "zustand";

type InfoResult = {
    status: string,
    message: string,
    email?: string | undefined,
};

type InfoState = {
    result: InfoResult | null,
    setResult: (res: InfoResult) => void,
};

export const useInfoStore = create <InfoState>((set) => ({
    result: null,
    setResult: (res) => set({ result: res }),
}))