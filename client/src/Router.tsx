import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { NotFound } from "./pages/NotFound";
import { Products } from "./pages/Products";
import { ShoppingCart } from "./pages/ShoppingCart";
import { Home } from "./pages/Home";
import { PaymentCancel } from "./pages/PaymentCancel";
import { PaymentSuccess } from "./pages/PaymentSuccess";

export const router = createBrowserRouter([{
    path: "/",
    element:<Layout/>,
    errorElement:<NotFound/>,
    children: [
        {
            path: "/",
            element: <Home/>,
            index: true,
        },
        {
            path: "/products",
            element: <Products/>
        },
        {
            path: "/shoppingcart",
            element: <ShoppingCart/>
        },
        {
            path: "/success",
            element: <PaymentSuccess/>
        }, 
        {
            path: "/cancel",
            element: <PaymentCancel/>
        }
    ]
}])