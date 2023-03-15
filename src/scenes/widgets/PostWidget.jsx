import {
  ChatBubbleOutlineOutlined,
  DeleteOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, deletePost } from "state";
import moment from "moment";
import { BACKEND_URL } from "config";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [reply, setReply] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const isOwnPost = loggedInUserId === postUserId;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`${BACKEND_URL}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleDelete = async () => {
    const response = await fetch(`${BACKEND_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      dispatch(deletePost({ postId }));
    }
  };

  const handleReply = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: reply }),
      });
      const data = await response.json();

      dispatch(setPost({ post: data }));
      setReply("");
    } catch (error) {
      console.log("Error occurred: ", error);
    }
  };

  // useEffect(() => {
  //   handleReply();
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Box sx={{ maxWidth: "800px" }}>
        <Typography
          color={main}
          sx={{
            mt: "1rem",
            overflowWrap: "break-word",
            wordWrap: "break-word",
          }}
        >
          {description}
        </Typography>
      </Box>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${BACKEND_URL}/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween>
          {isOwnPost && (
            <IconButton onClick={handleDelete}>
              <DeleteOutlineOutlined />
            </IconButton>
          )}
        </FlexBetween>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}

          <Box mt="1rem">
            <Typography variant="h6" gutterBottom>
              Reply to this post
            </Typography>
            <form onSubmit={handleReply}>
              <Box
                sx={{ display: "flex", alignItems: "flex-end", gap: "1rem" }}
              >
                <TextField
                  label="Your reply"
                  variant="outlined"
                  size="small"
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  sx={{ flex: 1 }}
                />
                <Button variant="contained" onClick={handleReply}>
                  Post
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
