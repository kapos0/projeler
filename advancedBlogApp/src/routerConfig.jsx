import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import PostEditCreate from "./pages/PostEditCreate.jsx";
import PostsList from "./components/PostsList";
import LikedPosts from "./pages/LikedPosts.jsx";
const errorElement = <ErrorPage />;

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement,
		children: [
			{
				path: "/",
				element: <PostsList />,
			},
			{
				path: "liked",
				element: <LikedPosts />,
			},
			{
				path: "detail/:postId",
				element: <PostDetail />,
			},
			{
				path: "editCreate/:postId",
				element: <PostEditCreate />,
			},
			{
				path: "detail/:postId/editCreate/:postId",
				element: <PostEditCreate isEdit={true} />,
			},
		],
	},
]);
