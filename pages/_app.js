import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { RecoilRoot } from 'recoil'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Layout from '../components/Layout'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <ThemeProvider>
    <Toaster />
    <RecoilRoot>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  </ThemeProvider>
}

export default MyApp
