"use client"

import wildWords from "@/app/lib/fonts/WildWords";
import React from "react";
import {TextItem} from "@/app/types";
import 'quill/dist/quill.core.css';

interface Props {
  value?: TextItem;
}

export default function ChapterMetadataText({value}: Props) {

  if (!value) return;

 return (
   <>
     {/* Override .ql-editor*/}
     <style type="text/css">
       {`.display-area.ql-editor {
          padding: 0;
          overflow: visible;
          text-align: inherit;
       }`}
     </style>
     <div
       className={`relative display-area ql-editor ${wildWords.className}`}
       style={{
         fontSize: value?.fontSize ?? 32,
         lineHeight: 1.25,
       }}
     >
       {/* Text outline*/}
       <div
         className={`
                  relative 
                  [-webkit-text-stroke:0.2em_white]
                  text-balance
                  whitespace-pre-line
                  `}
         dangerouslySetInnerHTML={{
           __html: value.text
         }}
       />
       {/* Actual text */}
       <span
         className={`
          text-balance
          absolute
          whitespace-pre-line
          inset-0 
       `}
         dangerouslySetInnerHTML={{
           __html: value.text
         }}
       />
     </div>
   </>
 );
};