import {
  GifBoxOutlined,
  ImageOutlined,
} from "@mui/icons-material";
import {
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import CreatePostWidget from "./CreatePostWidget";

const MyPostWidget = ({ picturePath }) => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const { palette } = useTheme();
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handleOpenCreatePostModal = () => {
    setIsCreatePostModalOpen(true);
  };

  const handleCloseCreatePostModal = () => {
    setIsCreatePostModalOpen(false);
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onClick={() => { handleOpenCreatePostModal() }}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "0.5rem 2rem",
            cursor:"pointer"
          }}
          readOnly
        />

      </FlexBetween>

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => { handleOpenCreatePostModal() }}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => { handleOpenCreatePostModal() }} >
          <GifBoxOutlined sx={{ color: mediumMain }} />
          <Typography color={mediumMain} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>Video</Typography>
        </FlexBetween>
        <Button
          onClick={() => { handleOpenCreatePostModal() }}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            cursor: "pointer",
            "&:hover": { color: palette.secondary.dark, backgroundColor: palette.primary.light }
          }}
        >
          POST
        </Button>
      </FlexBetween>

      {isCreatePostModalOpen && <CreatePostWidget isOpen={handleOpenCreatePostModal} handleClose={handleCloseCreatePostModal} />}

    </WidgetWrapper>
  );
};

export default MyPostWidget;
