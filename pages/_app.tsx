import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { LayoutRoot } from '../components/layout/layout-root';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LayoutRoot>
      <Head>
        <title>QuranMemo</title>
        <meta name="description" content="Menghafal Al-Quran di era digital" />
        <link rel="icon" href="/favicon.ico" />
        <meta content="#6BC4BA" name="theme-color" />
      </Head>
      <Component {...pageProps} />
    </LayoutRoot>
  );
}

export default MyApp;
