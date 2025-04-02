// 'use client';
//
// import {ReactNode, useEffect, useState} from 'react';
// import { useRouter } from 'next/navigation';
// import { Spinner } from "@heroui/react";
//
// export function ClientChapterWrapper({ children }: {children: ReactNode}) {
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();
//
//   useEffect(() => {
//     setIsLoading(false);
//
//     const handleStart = () => setIsLoading(true);
//     const handleComplete = () => setIsLoading(false);
//
//     router.events.on('routeChangeStart', handleStart);
//     router.events.on('routeChangeComplete', handleComplete);
//     router.events.on('routeChangeError', handleComplete);
//
//     return () => {
//       router.events.off('routeChangeStart', handleStart);
//       router.events.off('routeChangeComplete', handleComplete);
//       router.events.off('routeChangeError', handleComplete);
//     };
//   }, [router]);
//
//   if (isLoading) {
//     return (
//       <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
//         <Spinner size="lg" />
//       </div>
//     );
//   }
//
//   return children;
// }