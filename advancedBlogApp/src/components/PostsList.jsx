import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllPosts } from "../redux/slices/postsSlice";
import Post from "./Post";

export default function PostsList() {
	const dispatch = useDispatch();
	const posts = useSelector((state) => state.posts);
	useEffect(() => {
		dispatch(getAllPosts());
	}, [dispatch]);
	return (
		<div className="row d-flex justify-content-center">
			{posts.loading ? (
				<h1 className="text-center text-primary">Loading</h1>
			) : (
				posts.posts?.map((post) => (
					<Post
						key={post.id}
						post={post}
						isDetailed={false}
						isItFav={false}
					/>
				))
			)}
		</div>
	);
}
