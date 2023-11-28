import Home from "@/pages/home";
import Login from "@/pages/login";
import Editor from "@/pages/editor";
import Register from "@/pages/register";
import Protected from "@/common/protected";
import { Route } from "react-router-dom";
import { AppLayout, AuthLayout } from "@/components/layouts";

const AppRouter = (
  <>
    <Route
      path="/editor"
      element={
        <Protected>
          <Editor />
        </Protected>
      }
    />
    <Route path="/" element={<AppLayout />}>
      <Route index element={<Home />} />
      <Route element={<AuthLayout />}>
        <Route index path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Route>
  </>
);

export default AppRouter;
