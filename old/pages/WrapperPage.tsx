import * as React from "react";

import { ChevronLeft, Inbox as InboxIcon, Mail as MailIcon, Menu as MenuIcon, Notifications as NotificationsIcon } from "@mui/icons-material";
import { AppBar as MuiAppBar, AppBarProps as MuiAppBarProps, Badge, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, styled } from "@mui/material";

import LocaleContext from "../contexts/LocaleContext";
import UserContext from "../contexts/UserContext";

import UserAvatar from "../components/UserAvatar";

interface Properties {
	children: React.ReactNode;
}

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const width = 300;

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop != "open", })<AppBarProps>(({ theme, open }) => ({
	transition: theme.transitions.create(["margin", "width"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		width: `calc(100% - ${width}px)`,
		marginLeft: `${width}px`,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: "flex-end",
}));

const Main = styled("main", { shouldForwardProp: (prop) => prop != "open" })<{ open?: boolean; }>(({ theme, open }) => ({
	flexGrow: 1,
	transition: theme.transitions.create("margin", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	marginLeft: `${width}px`,
	...(!open && {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	}),
}));

export default function WrapperPage({ children }: Properties) {
	const [open, setOpen] = React.useState(true);
	const locale = React.useContext(LocaleContext);
	const { user } = React.useContext(UserContext);
	return (
		<Box>
			<AppBar position="sticky" open={open}>
				<Toolbar>
					<IconButton color="inherit" edge="start" onClick={() => setOpen(true)} sx={{ mr: 2, ...(open && { display: "none" }) }}>
						<MenuIcon />
					</IconButton>
					<Typography component="h1" variant="h6" noWrap>{locale.application.name}</Typography>
					<Box flexGrow={1} />
					<Box sx={{ display: { xs: "none", md: "flex" } }}>
						<IconButton color="inherit" size="large">
							<Badge badgeContent={0} color="error">
								<MailIcon />
							</Badge>
						</IconButton>
						<IconButton color="inherit" size="large">
							<Badge badgeContent={3} color="error">
								<NotificationsIcon />
							</Badge>
						</IconButton>
						<IconButton color="inherit" size="small">
							<UserAvatar user={user!} />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
			<Drawer
				sx={{
					width,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: width,
						boxSizing: "border-box",
					},
				}}
				variant="persistent"
				anchor="left"
				open={open}
			>
				<DrawerHeader>
					<IconButton onClick={() => setOpen(false)}>
						<ChevronLeft />
					</IconButton>
				</DrawerHeader>
				<Divider />
				<List>
					{["Timeline", "Backlog", "Board"].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemIcon>
									{index % 2 == 0 ? <InboxIcon /> : <MailIcon />}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
				<Divider />
				<List>
					{["Configuration"].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemIcon>
									{index % 2 == 0 ? <InboxIcon /> : <MailIcon />}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Drawer>
			<Main open={open}>{children}</Main>
		</Box>
	);
}