import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";

const HomePage = lazy(() => import("./pages/Home"));
const SearchPage = lazy(() => import("./pages/Search"));
const NotFoundPage = lazy(() => import("./pages/404"));
const JobDetail = lazy(() => import("./pages/Detail"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
	return (
		<>
			<Header />
			<Suspense
				fallback={
					<div
						style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1rem" }}
					>
						Cargando...
					</div>
				}
			>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/jobs/:jobId" element={<JobDetail />} />
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<ProfilePage />
							</ProtectedRoute>
						}
					/>
					<Route path="*" element={<NotFoundPage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Routes>
			</Suspense>
			<Footer />
		</>
	);
}

export default App;
