import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BookDetailView } from 'src/sections/blog/view';  // Named import
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`BookDetailPage - ${CONFIG.appName}`}</title>
      </Helmet>

       <BookDetailView /> 
    </>
  );
}
