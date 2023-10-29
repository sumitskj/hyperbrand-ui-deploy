import { Box } from "@mui/material";

const MenuContext = ({ top, left, regenerate }) => {

  return (
    <Box
      sx={{
        width: "200px",
        position: "absolute",
        borderRadius: "8px",
        backgroundColor: "#FAE8E0",
        top: `${top + 10}px`,
        left: `${left + 10}px`,
      }}
    >
      <Box sx={{p: '10px', ":hover": {backgroundColor: 'white'}}} onClick={regenerate}>Regenerate</Box>
    </Box>
  );
};

export default MenuContext;
