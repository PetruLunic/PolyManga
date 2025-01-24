import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  hasMore?: boolean; // Whether there are more items to load
  onLoadMore?: () => void; // Function to call when loading more items
  distance?: number; // The distance in pixels before the end of the items that will trigger a call to load more.
}

export const useInfiniteScroll = ({
                                    hasMore = true,
                                    onLoadMore,
                                    distance = 200
}: UseInfiniteScrollOptions) => {
  const loaderRef = useRef<HTMLDivElement | null>(null); // Reference for the loader element
  const scrollerRef = useRef<HTMLElement | null>(null); // Reference for the scrollable container

  useEffect(() => {
    if (!hasMore || !onLoadMore) return; // Stop observing if there are no more items to load

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onLoadMore(); // Trigger the load more function
        }
      },
      {
        root: scrollerRef.current || null, // Use custom scroller or fallback to viewport
        rootMargin: `0px 0px ${distance}px 0px`, // Trigger when loader is within {distance} of viewport/scroller
        threshold: 0.1, // Trigger when at least 10% of the loader is visible
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, onLoadMore]);

  return [loaderRef, scrollerRef] as const; // Return both refs
};
