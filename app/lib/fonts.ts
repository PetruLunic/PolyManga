import localFont from "next/font/local";
import {Oswald} from "next/font/google";

const wildWords = localFont({
  src: '../../public/fonts/WildWords.ttf',
  display: 'swap'
})

const oswald = Oswald({
  subsets: ["latin", "cyrillic", "latin-ext"],
  display: "swap"
});

const fonts = {
  "wildWords": wildWords,
  "oswald": oswald
} as const;

export default fonts;