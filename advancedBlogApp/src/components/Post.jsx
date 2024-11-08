import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { makeReaction } from "../redux/slices/postsSlice";
import { addToLikedPost, removeLikedPost } from "../redux/slices/likedSlice";
import { useSelector, useDispatch } from "react-redux";

export default function Post({ post, isDetailed, isItFav }) {
	const { likedPosts } = useSelector((state) => state.likedPosts);
	const dispatch = useDispatch();
	const isLiked = likedPosts.some((element) => element.id === post.id);
	function handleCLick() {
		if (isItFav) {
			dispatch(removeLikedPost(post));
		} else {
			dispatch(addToLikedPost(post));
		}
	}
	return (
		<div className="card m-2 col-md-5">
			<div className="card-body">
				<div className="d-flex justify-content-between">
					<h5 className="card-title">{post.title}</h5>
					{isLiked ? (
						isItFav ? (
							<button
								className="btn btn-info btn-sm text-white"
								onClick={handleCLick}>
								<i className="bi bi-trash2-fill"></i>
							</button>
						) : (
							<button className="btn btn-info btn-sm text-white">
								<i className="bi bi-star-fill"></i>
							</button>
						)
					) : (
						<button
							className="btn btn-info btn-sm text-light"
							onClick={handleCLick}>
							<i className="bi bi-star"></i>
						</button>
					)}
				</div>
				<h6 className="card-subtitle mb-2 text-body-secondary">
					User Id: {post.userId}, Post Views: {post.views}
				</h6>
				<p className="card-text">{post.body}</p>
				<a className="card-link text-decoration-none">
					{post?.tags[0]}
				</a>
				<a className="card-link text-decoration-none">
					{post?.tags[1]}
				</a>
				{isDetailed ? (
					<div className="my-1">
						<Link
							to={"editCreate/" + post.id}
							className="btn btn-secondary btn-sm">
							Edit
						</Link>
					</div>
				) : (
					""
				)}
			</div>
			<ul className="list-group list-group-flush">
				<li className="list-group-item">
					Likes:
					<button
						className="mx-2 btn btn-success btn-sm"
						onClick={() =>
							dispatch(
								makeReaction({
									postId: post.id,
									reactionType: "like",
								})
							)
						}>
						{post.reactions.likes}
					</button>
					| Dislikes:
					<button
						className="mx-2 btn btn-warning btn-sm"
						onClick={() =>
							dispatch(
								makeReaction({
									postId: post.id,
									reactionType: "dislike",
								})
							)
						}>
						{post.reactions.dislikes}
					</button>
				</li>
				{isDetailed ? (
					""
				) : (
					<li className="list-group-item">
						<Link
							to={"/detail/" + post.id}
							className="btn btn-primary">
							Go to post
						</Link>
					</li>
				)}
			</ul>
		</div>
	);
}

Post.propTypes = {
	post: PropTypes.object,
	isDetailed: PropTypes.bool,
	isItFav: PropTypes.bool,
};
