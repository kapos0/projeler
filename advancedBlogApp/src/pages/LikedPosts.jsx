import { useSelector } from "react-redux";
import Post from "../components/Post";

export default function LikedPosts() {
	const { likedPosts } = useSelector((state) => state.likedPosts);
	return (
		<div className="row d-flex justify-content-center">
			{likedPosts?.map((post) => (
				<Post
					key={post.id}
					post={post}
					isDetailed={false}
					isItFav={true}
				/>
			))}
		</div>
	);
}
