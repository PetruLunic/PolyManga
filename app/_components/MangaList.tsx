import React, {PropsWithChildren} from "react";
import {ScrollShadow} from "@nextui-org/react";

interface Props extends PropsWithChildren {
  title?: string;
  horizontal?: boolean;
}

export default function MangaList({ children, title, horizontal }: Props) {
  const childrenArray = React.Children.toArray(children);

  return (
      <div className="flex flex-col gap-3">
        {title && <h3 className="text-xl">{title}</h3>}
        <ScrollShadow isEnabled={horizontal} orientation="horizontal" size={30} hideScrollBar>
          <div className={`flex gap-2 ${!horizontal && "flex-wrap"} md:justify-start`}>
            {childrenArray.length !== 0 ? (
                childrenArray
            ) : (
                <div className="text-gray-400">There is no manga...</div>
            )}
          </div>
        </ScrollShadow>
      </div>
  );
}
