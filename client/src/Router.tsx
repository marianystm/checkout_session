import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { NotFound } from "./pages/NotFound";
import { Products } from "./pages/Products";
import { Home } from "./pages/Home";
import { PaymentCancel } from "./pages/PaymentCancel";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { CreateAccount } from "./pages/CreateAccount";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />  // Home sidan är tillgänglig utan autentisering
    <Route path="createaccount" element={<CreateAccount />} /> // Skapa konto tillgängligt utan autentisering
    <Route element={<ProtectedRoute />}>  // Skyddade rutter inneslutna inom ProtectedRoute
      <Route path="products" element={<Products />} />
      <Route path="success" element={<PaymentSuccess />} />
      <Route path="cancel" element={<PaymentCancel />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Route>
));
