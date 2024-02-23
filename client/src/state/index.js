import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  notifications: [],
  searchResults: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    updateUser: (state,action) => {
      state.user = action.payload.user;
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setSearchResult: (state, action) => {
      const updatedSearchResults = state.searchResults.map((searchResult) => {
        if (searchResult._id === action.payload.searchResult._id) return action.payload.searchResult;
        return searchResult;
      });
      state.searchResults = updatedSearchResults;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload.searchResults;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    markAsRead: (state, action) => {
      const targetNotification = action.payload.notification;

      const updatedNotifications = state.notifications.map(notification => {
        if (
          notification.action === targetNotification.action &&
          notification.commentBy === targetNotification.commentBy &&
          notification.message === targetNotification.message &&
          notification.postUserId === targetNotification.postUserId &&
          notification.Time === targetNotification.Time &&
          notification.actionPerformedBy === targetNotification.actionPerformedBy &&
          notification.name === targetNotification.name
        ) {
          return { ...notification, read: true };
        }
        return notification;
      });
      state.notifications = updatedNotifications;
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    removeNotification: (state, action) => {
      const indexToRemove = action.payload;
      state.notifications.splice(indexToRemove, 1);
    },
    setUpdateNotification: (state, action) => {
      const updatednotifications = action.payload;
      state.notifications = updatednotifications;
    },
  },
});

export const { updateUser,setMode, setLogin, setLogout, setFriends, setPosts, setPost, setSearchResults, setSearchResult, addNotification, markAsRead, clearNotifications, removeNotification, setUpdateNotification, } =
  authSlice.actions;
export default authSlice.reducer;