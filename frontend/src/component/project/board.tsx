import React from "react";

import {
	useParams
} from "react-router-dom";

import {
	Stack as MuiStack
} from "@mui/material";

import Main, { MainContextValue } from "component/main";
import ProjectBreadcrumbs from "component/project/breadcrumbs";
import StageGrid from "component/project/stage/grid/grid";

import Changelog from "model/common/changelog";
import Project from "model/project/project";

import projectService from "service/project/project-service";

interface Setup {

}

const setup: Setup = {

};

interface State {
	readonly content: Project | null;
	readonly ready: boolean;
}

const defaultState: State = {
	content: null,
	ready: false
};

type Action =
	{ type: "content.load", payload: Project } |
	{ type: "content.reload" }
	;

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "content.load": {
			return {
				...state,
				content: action.payload,
				ready: true
			};
		}
		case "content.reload": {
			return {
				...state,
				ready: false
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
	onError?: (error: Error) => void,
	onDelete?: (value: Project) => void,
	onRetrieve?: (value: Project) => void,
	onUpdate?: (changelog: Changelog<Project>) => void
};

function Component({
	onError,
	onRetrieve
}: Properties) {
	const mainContext: MainContextValue = React.useContext(Main.Context);
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	const locale: any = require(`locale/${mainContext.state.locale}/project/page/page.json`);
	const { projectId } = useParams();
	React.useEffect(() => {
		if (!state.ready && Number.isInteger(+projectId!)) {
			projectService.retrieveById(+projectId!)
				.then(async (response: Response) => {
					const body: any = await response.json();
					if (!response.ok) {
						const error: { message: string } = body;
						throw new Error(error.message);
					}
					const project: Project = body;
					dispatch({ type: "content.load", payload: project });
					onRetrieve?.(project);
				})
				.catch((error: Error) => {
					onError?.(error);
				});
		}
	}, [state.ready]);
	if (!state.ready) {
		return (<></>); // TODO: Loading.
	}
	if (state.content === null) {
		return (<></>); // TODO: Not found.
	}
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiStack>
				<ProjectBreadcrumbs value={state.content!} />
				<StageGrid project={state.content} />
			</MuiStack>
		</Context.Provider>
	);
}

export type ProjectBoardSetup = Setup;
export type ProjectBoardState = State;
export type ProjectBoardAction = Action;
export type ProjectBoardContextValue = ContextValue;
export type ProjectBoardProperties = Properties;
export const ProjectBoard = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default ProjectBoard;
