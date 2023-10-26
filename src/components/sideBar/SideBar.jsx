import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Drawer,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";

const SideBar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const container =
    window !== undefined ? () => window.document.body : undefined;

  const CustomisedListItemText = styled(ListItemText)`
    text-decoration: none;
    font-family: "Rubik";
    color: #212426;
    padding: 4px;
    border-radius: 8px;
    font-size: 0.9rem;
  `;

  const CustomisedListItemButton = styled(ListItemButton)`
    text-decoration: none;
    border-radius: 10px;
    &.active {
      font-weight: 600;
      background-color: #ebebeb;
    }
  `;

  const sidebarItems = [
    {
      name: "Home",
      path: "/user/home",
    },
    {
      name: "My Keywords",
      path: "/user/keywords",
    },
    {
      name: "My Titles",
      path: "/user/my-titles",
    },
    {
      name: "My Blogs",
      path: "/user/my-blogs",
    },
  ];

  const handleListItemClick = (path) => {
    if (mobileOpen) {
      handleDrawerToggle();
    }
    navigate(path, { replace: true });
  };

  const drawerWidth = 240;

  const drawer = (
    <>
      <Typography
        sx={{
          m: "1rem",
          fontFamily: "Pacifico",
          fontWeight: "500",
          fontSize: "1.2rem",
        }}
      >
        The Hyper Brand
      </Typography>
      <Divider />
      <List>
        {sidebarItems.map((text) => (
          <ListItem
            key={text.name}
            sx={{
              paddingTop: "0px",
              paddingBottom: "0px",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
          >
            <CustomisedListItemButton
              onClick={() => handleListItemClick(text.path)}
              disableRipple
              className={window.location.pathname === text.path ? "active" : ""}
            >
              <CustomisedListItemText primary={text.name} disableTypography />
            </CustomisedListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderWidth: "0px",
          },
          color: "#FBF9F9",
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        PaperProps={{ sx: { backgroundColor: "#FBF9F9" } }}
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderWidth: "0px",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Outlet />
    </>
  );
};

export default SideBar;
