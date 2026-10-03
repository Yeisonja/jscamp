import { NavLink } from "react-router";
import { Link } from "./Link";
import { useAuthStore } from "../store/authStore";
import { useFavoritesStore } from "../store/favoritesStore";

export function Header() {
	const { isLoggedIn } = useAuthStore();
	const { countFavorites } = useFavoritesStore();

	const numberOfFavorites = countFavorites();
	return (
		<header>
			<Link href="/" style={{ textDecoration: "none" }}>
				<h1 style={{ color: "white" }}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="icon icon-tabler icons-tabler-outline icon-tabler-code"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M7 8l-4 4l4 4" />
						<path d="M17 8l4 4l-4 4" />
						<path d="M14 4l-4 16" />
					</svg>
					DevJobs
				</h1>
			</Link>

			<nav>
				<NavLink
					className={({ isActive }) => (isActive ? "nav-link-active" : "")}
					to="/"
				>
					Inicio
				</NavLink>
				<NavLink
					className={({ isActive }) => (isActive ? "nav-link-active" : "")}
					to="/search"
				>
					Empleos
				</NavLink>

				{isLoggedIn && (
					<NavLink
						className={({ isActive }) => (isActive ? "nav-link-active" : "")}
						to="/profile"
					>
						Profile 💖{numberOfFavorites}
					</NavLink>
				)}
			</nav>

			<HeaderUserButton />
		</header>
	);
}

function HeaderUserButton() {
	const { isLoggedIn, login, logout } = useAuthStore();
	const { clearFavorites } = useFavoritesStore();

	// limpia los favoritos
	const handleLogout = () => {
		logout();
		clearFavorites();
	};
	return (
		<>
			{isLoggedIn ? (
				<button onClick={handleLogout}>Cerrar sesión</button>
			) : (
				<button onClick={login}>Iniciar sesión</button>
			)}
		</>
	);
}
