// src/components/MsalWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

const MsalProviderWithNoSSR = dynamic(
  () => import('@/auth/MsalProvider').then(mod => ({ default: mod.MsalProvider })),
  { ssr: false }
);

export default function MsalWrapper({ children }: { children: React.ReactNode }) {
  return <MsalProviderWithNoSSR>{children}</MsalProviderWithNoSSR>;
}