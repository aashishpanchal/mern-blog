import Home from "@/pages/home";
import Login from "@/pages/login";
import Editor from "@/pages/editor";
import Register from "@/pages/register";
import { Route } from "react-router-dom";
import Protected from "@/components/protected";
import { AppLayout, AuthLayout } from "@/components/layouts";

const AppRouter = (
  <>
    <Route path="/" element={<AppLayout />}>
      <Route
        path="/editor"
        element={
          <Protected>
            <Editor />
          </Protected>
        }
      />
      <Route index element={<Home />} />
      <Route element={<AuthLayout />}>
        <Route index path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Route>
  </>
);

export default AppRouter;
