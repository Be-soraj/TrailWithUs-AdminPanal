import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import AuthLayout from "./layout/AuthLayout";
import Dashboard from "./pages/Dashboard/dashboard";
import About from "./pages/About/about";
import { Services } from "./pages/Services/services";
import CreateTourWizard from "./pages/Services/CreateTourWizard";
import ServicesInfo from "./pages/Services/ServicesInfo";
import { BookedTour } from "./pages/BookedTours/bookedTours";
import ComingSoon from "./components/common/ComingSoonError";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ComingSoon message="ComingSoon !" />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "services", element: <Services /> },
      { path: "/services/:id", element: <ServicesInfo /> },
      {
        path: "services/create-tour",
        element: <CreateTourWizard />,
      },
      { path: "about", element: <About /> },
      { path: "bookedTour", element: <BookedTour /> },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <></> },
      { path: "signup", element: <></> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
