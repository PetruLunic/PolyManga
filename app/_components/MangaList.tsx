"use client"

import React, {JSX} from "react";
import {ScrollShadow, Spinner} from "@heroui/react";
import {useInfiniteScroll} from "@/app/lib/hooks/useInfiniteScroll";

type DivProps = JSX.IntrinsicElements["div"];

interface Props extends DivProps {
  title?: string;
  isHorizontal?: boolean;
  hasMore?: boolean; // Flag to indicate if there are more items to load
  isLoading?: boolean; // Flag to indicate if data is currently loading
  onLoadMore?: () => Promise<void>; // Callback function to load more data
}

const getClassNames = (isHorizontal: boolean | undefined) => {
  return isHorizontal
    ? "flex gap-1 sm:gap-2"
    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2";
};

export default function MangaList({
                                    children,
                                    title,
                                    isHorizontal,
                                    className,
                                    hasMore = false,
                                    isLoading = false,
                                    onLoadMore,
                                    ...props
                                  }: Props) {
  const childrenArray = React.Children.toArray(children);

  // Infinite scroll hook
  const [loaderRef] = useInfiniteScroll({
    hasMore,
    onLoadMore,
    distance: 200
  });

  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`} {...props}>
      {title && <h3 className="text-xl">{title}</h3>}
      <ScrollShadow
        isEnabled={isHorizontal}
        orientation={isHorizontal ? "horizontal" : "vertical"}
        size={30}
        hideScrollBar
      >
        <div className={`${getClassNames(isHorizontal)} md:justify-start`}>
          {childrenArray.length !== 0 ? (
            childrenArray
          ) : (
            <>
              {!isLoading && <div className="text-gray-400">There is no manga...</div>}
            </>
          )}
        </div>
        {/* Loader */}
        {hasMore && (
          <div className="flex justify-center py-4">
            <Spinner ref={loaderRef}/>
          </div>
        )}
      </ScrollShadow>
    </div>
  );
}
