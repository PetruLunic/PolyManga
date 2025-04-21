import localFont from "next/font/local";

const wildWords = localFont({
  src: '../../../public/fonts/WildWords.ttf',
  display: 'swap', // Optional: Improves rendering performance
});

export default wildWords;