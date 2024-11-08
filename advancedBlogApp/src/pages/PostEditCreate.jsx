import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { editPost, createPost } from "../redux/slices/postsSlice";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

export default function PostEditCreate({ isEdit }) {
	const [showAlert, setShowAlert] = useState(false);
	const [authorId, setAuthorId] = useState("");
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [tags, setTags] = useState("");
	const { posts } = useSelector((store) => store.posts);
	const params = useParams();
	const dispatch = useDispatch();
	useEffect(() => {
		if (isEdit) {
			const authorEl = document.getElementById("authorEl");
			if (authorEl) {
				authorEl.disabled = true;
			}
		}
	}, [isEdit]);
	function handlePostSubmit() {
		const arr = tags.split(",").map((tag) => tag.trim());
		const desiredPost = posts?.find((post) => post.id == params.postId);
		if (params.postId == "create") {
			const payload = {
				title: title.trim(),
				body: body.trim(),
				authorId: authorId,
				tags: arr,
			};
			dispatch(createPost(payload));
			setAuthorId("");
			setTitle("");
			setBody("");
			setTags("");
		} else {
			const payload = {
				id: desiredPost.id,
				title: title.trim() != "" ? title : desiredPost.title,
				body: body.trim() != "" ? body : desiredPost.body,
				tags: tags != null ? arr : desiredPost.tags,
			};
			dispatch(editPost(payload));
			setTitle("");
			setBody("");
			setTags("");
		}
		setShowAlert(true);
		setTimeout(() => {
			setShowAlert(false);
		}, 3000);
	}

	return (
		<div className="container mt-5">
			<h1 className="mb-4">
				{params.postId == "create" ? "Create Post" : "Edit Post"}
			</h1>
			{showAlert && (
				<div
					className="alert alert-success"
					role="alert">
					Post sent successfully!
				</div>
			)}

			<form>
				<div className="mb-3">
					<label
						htmlFor="author"
						className="form-label">
						Author id
					</label>
					<input
						type="number"
						id="authorEl"
						onChange={(e) => setAuthorId(e.target.value)}
						value={authorId}
						className="form-control"
						placeholder="Enter author id"
					/>
				</div>

				<div className="mb-3">
					<label
						htmlFor="title"
						className="form-label">
						Title
					</label>
					<input
						type="text"
						className="form-control"
						placeholder="Enter a title"
						onChange={(e) => setTitle(e.target.value)}
						value={title}
					/>
				</div>

				<div className="mb-3">
					<label
						htmlFor="content"
						className="form-label">
						Content
					</label>
					<textarea
						className="form-control"
						rows="5"
						onChange={(e) => setBody(e.target.value)}
						value={body}
						placeholder="Enter content"></textarea>
				</div>

				<div className="mb-3">
					<label
						htmlFor="tags"
						className="form-label">
						Tags
					</label>
					<input
						type="text"
						className="form-control"
						onChange={(e) => setTags(e.target.value)}
						value={tags}
						placeholder="Enter tags separated by comma"
					/>
				</div>

				<button
					type="button"
					className="btn btn-primary"
					onClick={handlePostSubmit}>
					Send
				</button>
			</form>
		</div>
	);
}
PostEditCreate.propTypes = {
	isEdit: PropTypes.bool,
};
