import { NavLink } from "react-router-dom";
export default function Header() {
	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary">
			<div className="container-fluid">
				<NavLink
					to={"/"}
					className={({ isActive }) =>
						isActive ? "navbar-brand text-primary" : "navbar-brand"
					}>
					Home
				</NavLink>
				<div className="navbar-nav">
					<NavLink
						to={"/liked"}
						className={({ isActive }) =>
							isActive ? "nav-link text-primary" : "nav-link"
						}>
						Liked Posts
					</NavLink>
					<NavLink
						to={"editCreate/create"}
						className={({ isActive }) =>
							isActive ? "nav-link text-primary" : "nav-link"
						}>
						Create Post
					</NavLink>
				</div>
			</div>
		</nav>
	);
}
