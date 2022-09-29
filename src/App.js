import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Layout from "./components/Layout";
import Navigation from "./Navigation";

function App() {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <Layout>
          <Toaster />
          <Navigation />
        </Layout>
      </RecoilRoot>
    </BrowserRouter>
  );
}

export default App;
