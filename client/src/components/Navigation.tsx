import { NavLink } from "react-router-dom"

export const Navigation = () => {
    return<>
    <nav>
        <ul>
            <li><NavLink to={'/'}>Logga in</NavLink></li>
            <li><NavLink to={'/createaccount'}>Skapa konto</NavLink></li>
            <li><NavLink to={'/products'}>Produkter</NavLink></li>
        </ul>
    </nav>
    </>
}


