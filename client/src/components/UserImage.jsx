import { Box } from "@mui/material";
import url from '../api/Serverhost';

const UserImage = ({ image, size = "50px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`${url}/assets/${image}`}
        // src={`${image}`}
      />
    </Box>
  );
};

export default UserImage;
