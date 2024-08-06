"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";

interface WritableSearchParams{
  setParam: ({}: {[key: string]: string | string[]}) => void;
  deleteParam: (key: string | string[], value?: string) => void;
  replaceParam: ({}: {[key: string]: string | string[]}) => void;
}

export const useQueryParams = (): WritableSearchParams => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return {
    setParam: (keys) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(keys).forEach(([key, value]) => {
        // If the value of the query is nullable then delete it
        if (!keys[key]) {
          current.delete(key);
        } else if (typeof value === "string") {
          current.set(key, value);
        } else {
          // If the array is empty then delete this param
          if (value.length === 0) {
            current.delete(key)
          } else {
            // Append to the params if it hasn't the same value
            value.forEach(elem => {
              if (!current.has(key, elem)) {
                current.append(key, elem);
              }
            })
          }
        }
      })

      router.replace(`${pathname}/?${current.toString()}`, { scroll: false });
    },
    deleteParam: (key: string | string[], value) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (typeof key === "string") {
        current.delete(key, value);
      } else {
        key.forEach(k => {
          current.delete(k, value);
        })
      }

      router.replace(`${pathname}/?${current.toString()}`, { scroll: false });
    },
    // For the string value is the same effect, for the array, it replaces every value, instead of appending it
    replaceParam: (keys) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(keys).forEach(([key, value]) => {
        // If the value of the query is nullable then delete it
        if (!keys[key]) {
          current.delete(key);
        } else if (typeof value === "string") {
          current.set(key, value);
        } else {
          // Delete the key of param
          current.delete(key);

          // Append new values
          value.forEach(elem => {
            if (!current.has(key, elem)) {
              current.append(key, elem);
            }
          })

        }
      })

      router.replace(`${pathname}/?${current.toString()}`, { scroll: false });
    }
  }
}