import React from "react";

import {
	useParams
} from "react-router-dom";

import {
	Stack as MuiStack
} from "@mui/material";

import Changelog from "model/common/changelog";
import Project from "model/project/project";

import projectService from "service/project/project-service";
import ProjectBreadcrumbs from "./breadcrumbs";
import IterationList from "./iteration/list/list";

interface State {
	readonly content: Project | null;
	readonly ready: boolean;
}

export const defaultState: State = {
	content: null,
	ready: false
};

type Action =
	{ type: "content.load", payload: Project } |
	{ type: "content.reload" }
	;

export function reducer(state: State, action: Action): State {
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
	onDelete,
	onRetrieve,
	onUpdate
}: Properties) {
	const { projectId } = useParams();
	const [state, dispatch] = React.useReducer(reducer, defaultState);
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
		return (
			<Context.Provider value={{ state, dispatch }}>
				{/* TODO: Skeleton. */}
			</Context.Provider>
		);
	}
	if (state.content === null) {
		return (
			<Context.Provider value={{ state, dispatch }}>
				{/* TODO: Not found. */}
			</Context.Provider>
		);
	}
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiStack>
				<ProjectBreadcrumbs value={state.content!} variant="backlog" />
				<IterationList project={state.content} />
			</MuiStack>
		</Context.Provider>
	);
}

export type ProjectBacklogContextValue = ContextValue;
export type ProjectBacklogProperties = Properties;

export const ProjectBacklog = Component;
export const ProjectBacklogContext = Context;

export default ProjectBacklog;
