import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Post from "../components/Post";
export default function PostDetail() {
	const { postId } = useParams();
	const { posts } = useSelector((store) => store.posts);
	const desiredPost = posts?.find((post) => post.id == postId);
	return (
		<div className="d-flex justify-content-center">
			<Post
				post={desiredPost}
				isDetailed={true}
				isItFav={false}
			/>
		</div>
	);
}
