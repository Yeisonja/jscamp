import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FavoritesProvider } from "./context/FavContext.jsx";

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<AuthProvider>
			<FavoritesProvider>
				<App /> {/** <--- children */}
			</FavoritesProvider>
		</AuthProvider>
	</BrowserRouter>,
);
