import { useEffect, useState } from "react";

function useQuery<T>(
  query: () => Promise<T>,
  defaultValue: T,
  pollInterval = 1000,
) {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async () => {
      try {
        const result = await query();
        setData(result);
        setLoading(false);
      } catch (e) {
        if (e instanceof Error) {
          setError(e);
        }
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      query().then((newData) => {
        setData(newData);
      });
    }, pollInterval);

    return () => clearInterval(interval);
  }, [query, pollInterval]);

  return { data, loading, error };
}

export default useQuery;
