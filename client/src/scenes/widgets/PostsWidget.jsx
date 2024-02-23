import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index";
import PostWidget from "./PostWidget";
import url from '../../api/Serverhost';

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.posts);

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getPosts = async () => {
    const response = await fetch(`${url}/posts`, {
      method: "GET",
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(`${url}/posts/${userId}/posts`, {
      method: "GET",
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  return (
    <>
      {post.map(
        ({
          _id,
          userId,
          fullName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${fullName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
