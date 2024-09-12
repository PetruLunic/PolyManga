import React, {PropsWithChildren} from "react";

interface Props extends PropsWithChildren {}

export default function MangaList({ children }: Props) {
  const childrenArray = React.Children.toArray(children);

  return (
      <div className="flex justify-center gap-3 flex-wrap md:justify-start">
        {childrenArray.length !== 0 ? (
            childrenArray
        ) : (
            <div className="text-gray-400">There is no manga...</div>
        )}
      </div>
  );
}
