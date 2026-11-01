import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

type BarProps = {
  route: string;
  routes: string[];
  onRouteChange: (route: string) => void;
};

export default function Bar({ route, routes, onRouteChange }: BarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleRouteChange = (nextRoute: string) => {
    onRouteChange(nextRoute);
    setMenuOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1, mb: "16px" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            aria-label="メニューを開く"
            onClick={() => setMenuOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            App
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        <Box
          role="presentation"
          sx={{ width: 250 }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setMenuOpen(false);
            }
          }}
        >
          <List aria-label="機能メニュー">
            {routes.map((item) => (
              <ListItemButton
                key={item}
                selected={item === route}
                onClick={() => handleRouteChange(item)}
              >
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </Box>
  );
}
