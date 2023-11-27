import React from "react";

import {
	Stack as MuiStack
} from "@mui/material";

import CollaborationTable from "component/project/collaboration/table/table";
import ProjectManager from "component/project/manager";

function Component() {
	return (
		<MuiStack padding={2} spacing={2}>
			<ProjectManager />
			<CollaborationTable />
		</MuiStack>
	);
}

export const Home = Component;

export default Home;
