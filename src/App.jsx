import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Layout from "./components/Layout";
import ThemeProvider from "./context/ThemeContext";
import Navigation from "./Navigation";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";


function App() {
  const [theme, setTheme] = useState("dark");
  const [worker, setWorker] = useState();
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

  const onServiceWorkerUpdate = (registration) => {
    setWorker((registration && registration.waiting) ?? undefined);
    setNewVersionAvailable(true);
  };

  const updateServiceWorker = () => {
    worker?.postMessage({ type: "SKIP_WAITING" });
    setNewVersionAvailable(false);
    window.location.reload();
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      serviceWorkerRegistration.register({ onUpdate: onServiceWorkerUpdate });
      navigator.serviceWorker.ready.then((registration) => {
        console.log("servie worker enabled");
      });
    }
  }, []);

  return (
    <ThemeProvider value={{ theme, setTheme }}>
      <BrowserRouter>
        <Helmet title="Coffee Break">
          <html data-theme={theme} lang="en" />
        </Helmet>
        <RecoilRoot>
          <Layout>
            {newVersionAvailable && (
              <div className="alert alert-info">
                <div className="flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 mx-2 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <label>A new version of this application is available.</label>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={updateServiceWorker}
                >
                  Reload
                </button>
              </div>
            )}
            <Toaster />
            <Navigation />
          </Layout>
        </RecoilRoot>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
