import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";

// ruta protegida
export function ProtectedRoute({ children }) {
	const { isLoggedIn } = useAuthStore();

	if (!isLoggedIn) {
		// si no ha iniciado sesión devolvemos el componente Navigate y lo enviamos
		// a la página de login.
		return <Navigate to="/login" replace />;
	}

	return children;
}
