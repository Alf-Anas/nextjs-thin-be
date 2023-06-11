import { errorResponse } from "@/utils";
import { useState } from "react";

type CustomArg = { onError?: (err: any) => void };

const useAPI = <DataType, ParamsType>(
  API: Function,
  args?: CustomArg
): {
  data: DataType | null;
  loading: boolean;
  error: any;
  call: (params?: ParamsType) => void;
} => {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const call = (params?: ParamsType) => {
    setLoading(true);
    setData(null);
    API(params || {})
      .then((res: any) => {
        const datas = res.data;
        if (!datas) throw new Error(res.status.toString());
        setData(datas);
        setError(null);
      })
      .catch((err: any) => {
        setData(null);
        setError(errorResponse(err));
        if (args?.onError) {
          args.onError(errorResponse(err));
        }
      })
      .finally(() => setLoading(false));
  };

  return { data, loading, error, call };
};
export default useAPI;
