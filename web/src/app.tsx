import router from "./routers";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import PageRefresh from "./components/page-refresh";

function App() {
  return (
    <PageRefresh>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} />
    </PageRefresh>
  );
}

export default App;
