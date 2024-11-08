import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { logo } from "../utils/constants";
import { SearchBar } from "./";

const Navbar = () => (
	<Box
		display="flex"
		justifyContent="center">
		<nav className="navbar navbar-expand-lg">
			<div className="container-fluid">
				<Link
					to="/"
					className="navbar-brand"
					style={{ display: "flex", alignItems: "center" }}>
					<img
						src={logo}
						alt="logo"
						width={45}
					/>
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNavDropdown"
					aria-controls="navbarNavDropdown"
					aria-expanded="false"
					aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div
					className="collapse navbar-collapse"
					id="navbarNavDropdown">
					<ul className="navbar-nav">
						<li className="nav-item">
							<Link
								to="/"
								className="nav-link active"
								aria-current="page">
								Anasayfa
							</Link>
						</li>
						<li className="nav-item">
							<a
								href="https://www.meram.bel.tr/baskan"
								className="nav-link">
								Başkan
							</a>
						</li>
						<li className="nav-item">
							<a
								href="https://www.meram.bel.tr/projeler"
								className="nav-link">
								Projeler
							</a>
						</li>
						<li className="nav-item dropdown">
							<a
								className="nav-link dropdown-toggle"
								href="#"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false">
								Daha fazla
							</a>
							<ul className="dropdown-menu">
								<li>
									<a
										href="https://www.meram.bel.tr/kurumsal"
										className="dropdown-item">
										Kurumsal
									</a>
								</li>
								<li>
									<a
										href="https://www.meram.bel.tr/iletisim"
										className="dropdown-item">
										İletişim
									</a>
								</li>
								<li>
									<a
										href="#"
										className="dropdown-item">
										444 3 042
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	</Box>
);

export default Navbar;