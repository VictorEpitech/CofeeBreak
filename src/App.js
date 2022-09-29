import {useState} from 'react';
import {Helmet} from 'react-helmet';
import {Toaster} from 'react-hot-toast';
import {BrowserRouter} from 'react-router-dom';
import {RecoilRoot} from 'recoil';
import Layout from './components/Layout';
import ThemeProvider from './context/ThemeContext';
import Navigation from './Navigation';

function App () {
  const [theme, setTheme] = useState ('dark');

  return (
    <ThemeProvider value={{theme, setTheme}}>
      <BrowserRouter>
        <Helmet><html data-theme={theme} /></Helmet>
        <RecoilRoot>
          <Layout>
            <Toaster />
            <Navigation />
          </Layout>
        </RecoilRoot>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
