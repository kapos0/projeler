import { createSlice } from "@reduxjs/toolkit";

function writeToLocal(arr) {
	localStorage.setItem("likedPosts", JSON.stringify(arr));
}
function getFromLocal() {
	if (localStorage.getItem("likedPosts"))
		return JSON.parse(localStorage.getItem("likedPosts"));
	else return [];
}

const initialState = {
	likedPosts: getFromLocal(),
};
const likedPostsSlice = createSlice({
	name: "likedPosts",
	initialState,
	reducers: {
		addToLikedPost: (state, action) => {
			state.likedPosts.push(action.payload);
			writeToLocal(state.likedPosts);
		},
		removeLikedPost: (state, action) => {
			const extractedPosts = state.likedPosts?.filter(
				(post) => post.id !== action.payload.id
			);
			state.likedPosts = [...extractedPosts];
			writeToLocal(state.likedPosts);
		},
	},
});

export const { addToLikedPost, removeLikedPost } = likedPostsSlice.actions;
export default likedPostsSlice.reducer;
