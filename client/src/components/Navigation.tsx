import { NavLink } from "react-router-dom"

export const Navigation = () => {
    return<>
    <nav>
        <ul>
            <li><NavLink to={'/'}>Hem</NavLink></li>
            <li><NavLink to={'/products'}>Produkter</NavLink></li>
            <li><NavLink to={'/shoppingcart'}>Kundvagn</NavLink></li>
        </ul>
    </nav>
    </>
}