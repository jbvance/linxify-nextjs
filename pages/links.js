import { useEffect } from 'react';
import { getSession } from 'next-auth/client';
import axios from 'axios';

const LinksPage = (props) => {
  useEffect(() => {
    getLinks();
    //console.log('loaded');
  }, []);
  return <div>Links go here</div>;
};

const getLinks = async () => {
  const results = await axios.get('/api/links');
  console.log(results.data);
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false
      }
    };
  }
  return {
    props: { session }
  };
}

export default LinksPage;
