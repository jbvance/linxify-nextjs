import { Provider } from 'next-auth/client';
import Layout from '../components/layout/layout';
import { NotificationContextProvider } from '../store/notification-context';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <NotificationContextProvider>
      <Provider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </NotificationContextProvider>
  );
}

export default MyApp;
