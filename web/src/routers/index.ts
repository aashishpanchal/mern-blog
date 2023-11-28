import {
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import AppRouter from "./app.router";

const router = createBrowserRouter(createRoutesFromElements([AppRouter]));

export default router;
