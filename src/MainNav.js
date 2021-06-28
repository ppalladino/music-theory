import { Link } from 'react-router-dom';

const MainNav = () => {
    return (
        <div>
            <Link to="/">Home</Link>
            |
            <Link to="/music-theory/guitar-scales">Guitar Scales</Link>
        </div>
    )
}

export default MainNav;