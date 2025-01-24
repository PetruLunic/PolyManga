import { useEffect, useState } from "react";
import {useQuery, QueryHookOptions, DocumentNode, OperationVariables} from "@apollo/client";

interface UseInfiniteQueryOptions<TData extends TData[], TVariables extends OperationVariables> extends QueryHookOptions<TData, TVariables> {
  trigger: any; // The state that triggers loading more data
}

export const useInfiniteQuery = <TData extends TData[], TVariables extends OperationVariables>(
  query: DocumentNode,
  options: UseInfiniteQueryOptions<TData, TVariables>,
) => {
  const { trigger, ...queryOptions } = options;
  const [results, setResults] = useState<TData[]>([]); // Accumulated results
  const [hasMore, setHasMore] = useState(true); // Flag to indicate if more data is available
  const { data, loading, fetchMore } = useQuery<TData, TVariables>(query, queryOptions);

  // Helper function to check if data is iterable
  const isIterable = (obj: any): obj is Iterable<any> => {
    return obj != null && typeof obj[Symbol.iterator] === "function";
  };

  // Effect to handle fetching and accumulating data when the trigger changes
  useEffect(() => {
    const fetchMoreData = async () => {
      if (!hasMore || loading) return;

      const newResults = await fetchMore({
        variables: queryOptions.variables,
      });

      if (newResults?.data) {

        if (Array.isArray(newResults.data)) {
          setResults((prevResults) => [...prevResults, ...newResults.data]);
        }

        if (
          Array.isArray(newResults.data) &&
          newResults.data.length < (queryOptions.variables?.limit || 0)
        ) {
          setHasMore(false); // No more data if fewer items than the limit are returned
        }
      }
    };

    fetchMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return { results, loading, hasMore };
};
