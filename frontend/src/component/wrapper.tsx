import React from "react";

import {
	ChevronLeft as ChevronLeftIcon,
	Mail as MailIcon,
	Menu as MenuIcon,
	Notifications as NotificationsIcon
} from "@mui/icons-material";

import {
	AppBar as MuiAppBar,
	Badge as MuiBadge,
	Box as MuiBox,
	Divider as MuiDivider,
	Drawer as MuiDrawer,
	IconButton as MuiIconButton,
	SxProps as MuiSxProps,
	Theme as MuiTheme,
	Toolbar as MuiToolbar,
	Typography as MuiTypography,
	useTheme as muiUseTheme
} from "@mui/material";

import Main, { MainContextValue } from "component/main";
import UserAvatar from "component/user/avatar";

interface Setup {
	readonly drawer: {
		readonly width: number
	}
}

const setup: Setup = {
	drawer: {
		width: 360
	}
};

interface State {
	readonly drawer: {
		readonly open: boolean
	};
};

const defaultState: State = {
	drawer: {
		open: false
	}
};

type Action =
	{ type: "drawer.close" } |
	{ type: "drawer.open" }
	;

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "drawer.close": {
			return {
				...state,
				drawer: {
					...state.drawer,
					open: false
				}
			};
		}
		case "drawer.open": {
			return {
				...state,
				drawer: {
					...state.drawer,
					open: true
				}
			};
		}
	}
}

interface ContextValue {
	readonly state: State;
	readonly dispatch?: (action: Action) => void;
}

const Context = React.createContext<ContextValue>({ state: defaultState });

type Properties = {
	children?: any
};

function Component({
	children
}: Properties) {
	const mainContext: MainContextValue = React.useContext(Main.Context);
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	const theme: MuiTheme = muiUseTheme();
	const locale: any = require(`locale/${mainContext.state.locale}/wrapper.json`);
	const transition = (properties: string | string[], options: MuiSxProps<MuiTheme>): MuiSxProps<MuiTheme> => state.drawer.open
		? {
			...options,
			transition: theme.transitions.create(properties, {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			})
		}
		: {
			transition: theme.transitions.create(properties, {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			})
		};
	if (!mainContext.state.ready) {
		return <></>; // TODO: Make skeleton.
	}
	if (mainContext.state.user === null) {
		return children;
	}
	return (
		<>
			<MuiDrawer
				anchor="left"
				open={state.drawer.open}
				sx={{
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: { xs: "100vw", md: `${setup.drawer.width}px` }
					},
					position: "fixed",
					width: { xs: "100vw", md: `${setup.drawer.width}px` },
					zIndex: 2000
				}}
				variant="persistent"
			>
				<MuiBox
					display="flex"
					paddingX={1}
					sx={{
						alignItems: "center",
						display: "flex",
						paddingX: 1,
						...theme.mixins.toolbar,
						justifyContent: "flex-end"
					}}
				>
					<MuiIconButton onClick={() => dispatch({ type: "drawer.close" })}>
						<ChevronLeftIcon />
					</MuiIconButton>
				</MuiBox>
				<MuiDivider />
			</MuiDrawer>
			<MuiAppBar sx={transition(["margin-left", "width"], {
				marginLeft: { md: `${setup.drawer.width}px` },
				width: { md: `calc(100% - ${setup.drawer.width}px)` }
			})}>
				<MuiToolbar>
					<MuiIconButton
						color="inherit"
						edge="start"
						onClick={() => dispatch({ type: "drawer.open" })}
						sx={transition("margin-left", {
							marginLeft: { md: "-64px" }
						})}
					>
						<MenuIcon />
					</MuiIconButton>
					<MuiTypography component="h1" marginLeft={2} noWrap variant="h6">
						{locale.title}
					</MuiTypography>
					<MuiBox flexGrow={1} />
					<MuiBox sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
						<MuiIconButton color="inherit" size="large">
							<MuiBadge badgeContent={0} color="error">
								<MailIcon />
							</MuiBadge>
						</MuiIconButton>
						<MuiIconButton color="inherit" size="large">
							<MuiBadge badgeContent={3} color="error">
								<NotificationsIcon />
							</MuiBadge>
						</MuiIconButton>
						<MuiIconButton color="inherit" size="small">
							<UserAvatar value={mainContext.state.user} />
						</MuiIconButton>
					</MuiBox>
				</MuiToolbar>
			</MuiAppBar>
			<MuiBox
				flexGrow={1}
				marginTop={{ xs: "56px", md: "64px" }}
				sx={transition(["margin-left", "width"], {
					marginLeft: { md: `${setup.drawer.width}px` },
					width: { md: `calc(100% - ${setup.drawer.width}px)` }
				})}
			>
				{children}
			</MuiBox >
		</>
	);
}

export type WrapperSetup = Setup;
export type WrapperState = State;
export type WrapperAction = Action;
export type WrapperContextValue = ContextValue;
export type WrapperProperties = Properties;
export const Wrapper = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default Wrapper;
