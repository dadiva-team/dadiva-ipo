import React, { ReactElement } from "react";
import { Location } from "react-router-dom";
import { Button, ListItem, ListItemIcon, ListItemText } from "@mui/material";

export interface NavItem {
  text: string;
  icon: ReactElement;
  path: string;
  disabled: boolean;
}

export function navBuilder(items: NavItem[], navigate: (path: string) => void, location: Location) {
  return items.map(item => (
    <ListItem key={item.text}>
      <Button disabled={location.pathname === item.path || item.disabled} onClick={() => navigate(item.path)}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </Button>
    </ListItem>
  ));
}