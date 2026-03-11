import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { Admin } from "./pages/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "projects", element: <Projects /> },
      { path: "projects/:id", element: <ProjectDetail /> },
      { path: "admin", element: <Admin /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);