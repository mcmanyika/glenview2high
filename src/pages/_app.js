import React from 'react';
import { MenuProvider } from '../app/components/MenuContext'; // Update path as per your file structure

function MyApp({ Component, pageProps }) {
  return (
    <MenuProvider>
      <Component {...pageProps} />
    </MenuProvider>
  );
}

export default MyApp;
