import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";

import Nav from "./components/Nav";
import { Outlet } from "react-router-dom";

export default function App() {
	return (
		<main className="container mt-2">
			<Nav />
			<Outlet />
		</main>
	);
}
