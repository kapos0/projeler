import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlphabet } from "nanoid";

const BASE_URL = "https://dummyjson.com/";
const digits = "0123456789";
const length = 10;
const nanoid = customAlphabet(digits, length);

function writePostsToSession(posts) {
  sessionStorage.setItem("posts", JSON.stringify(posts));
}

function getPostsFromSession() {
  if (sessionStorage.getItem("posts"))
    return JSON.parse(sessionStorage.getItem("posts"));
}

export const getAllPosts = createAsyncThunk("getAllPosts", async () => {
  if (getPostsFromSession()) return getPostsFromSession();
  const response = await axios.get(`${BASE_URL}posts`);
  return response.data.posts;
});

const initialState = {
  posts: getPostsFromSession(),
  loading: false,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    makeReaction: (state, action) => {
      state.posts?.forEach((post) => {
        if (post.id === action.payload.postId)
          if (action.payload.reactionType === "like") post.reactions.likes += 1;
          else post.reactions.dislikes += 1;
      });
      writePostsToSession(state.posts);
    },
    editPost: (state, action) => {
      state.posts?.forEach((post) => {
        if (post.id == action.payload.id) {
          post.title = action.payload.title;
          post.body = action.payload.body;
          post.tags = action.payload.tags;
        }
      });
      writePostsToSession(state.posts);
      //You can also do it by map
      /*
				state.posts = state.posts.map((post) =>
        			post.id === action.payload.id ? { ...post, ...action.payload } : post
    			);
			*/
    },
    createPost: (state, action) => {
      if (action.payload) {
        const item = {
          ...action.payload,
          id: nanoid(),
          views: 1481,
          reactions: { likes: 0, dislikes: 0 },
        };
        state.posts.push(item);
      }
      writePostsToSession(state.posts);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllPosts.pending, (state) => {
      state.loading = !state.loading;
    });
    builder.addCase(getAllPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      writePostsToSession(state.posts);
      state.loading = !state.loading;
    });
    builder.addCase(getAllPosts.rejected, (state) => {
      state.loading = !state.loading;
    });
  },
});

export const { createPost, editPost, makeReaction } = postsSlice.actions;
export default postsSlice.reducer;
