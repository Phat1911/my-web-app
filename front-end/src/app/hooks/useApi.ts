import { useState } from "react";

export function useApi<T>() {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const request = async (apiCall: () => Promise<T>) => {
        setLoading(true);
        setError(null);

        try {
            const result = await apiCall();
            setData(result);
            return result;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        setData,
        loading,
        error,
        request,
    };
}
