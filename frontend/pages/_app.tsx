import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { Provider as NextAuthProvider } from "next-auth/client";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "components/layout";
import theme from "../theme"

const App = ({ Component, pageProps }: AppProps) => {
  const { session } = pageProps;

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </Head>
      <NextAuthProvider session={session}>
        <ChakraProvider resetCSS theme={theme}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
        </ChakraProvider>
      </NextAuthProvider>
    </>
  );
};

export default App;
