import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import url from '../api/Serverhost';
import { Box, Divider, Slide } from '@mui/material';
import EditPost from './EditPost';
import { Close } from '@mui/icons-material';

const options = ['Delete Post', 'Edit Post']; // Removed "Edit Profile" option
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PostOperation({ postId }) {
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1); // Initialize to -1
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const DeletePost = async () => {
    try {
      const response = await fetch(`${url}/posts/${postId}/deletePost`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        // Show an alert after successful deletion
        window.alert('Post deleted successfully');
        // Refresh the page
        window.location.reload();
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const openEditDialog = () => {
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleMenuItemClick = async (event, index) => {
    setSelectedIndex(index);
    setOpen(false);

    if (index === 0) {
      if (window.confirm('Are you sure you want to delete this post?')) {
        await DeletePost();
        console.log('Delete Post API call triggered', postId);
      }
    } else if (index === 1) {
      if (window.confirm('Are you sure you want to update this post?')) {
        openEditDialog(); 
        console.log('Update Post API call triggered', postId);
      }
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton
        ref={anchorRef}
        aria-controls={open ? 'split-button-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-label="select merge strategy"
        aria-haspopup="menu"
        onClick={handleToggle}
      >
        <MoreVertIcon />
      </IconButton>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <Dialog open={editDialogOpen} onClose={closeEditDialog} TransitionComponent={Transition} fullWidth>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width:"100%" }}>
          <DialogTitle sx={{ fontSize: "1.3rem" }}>Edit Post</DialogTitle>
          <IconButton onClick={closeEditDialog} sx={{ marginRight: "10px" }}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <>
          <EditPost postId={postId} closeEditDialog={closeEditDialog} />
        </>
      </Dialog>
    </React.Fragment>
  );
}
