import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { RecoilRoot } from 'recoil'
import Layout from '../components/Layout'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <ThemeProvider defaultTheme="dark">
    <Toaster />
    <RecoilRoot>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  </ThemeProvider>
}

export default MyApp
