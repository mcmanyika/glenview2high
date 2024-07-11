import React from 'react';
import Layout from '../app/components/Layout2';
import Gallery from '../app/components/Gallery'

export default function GalleryInfo() {
  return (
    <Layout templateText="Gallery">
      <section className="p-4 m-0 text-gray-800">
        <div className="container mx-auto">
          <Gallery />
        </div>
      </section>
    </Layout>
  );
}
