import React from "react";

import {
	Draggable as RbdDraggable,
	DragDropContext as RbdDragDropContext
} from "react-beautiful-dnd";

import {
	ImageList as MuiImageList,
	ImageListItem as MuiImageListItem
} from "@mui/material";

import Droppable from "component/droppable";
import StageGridColumn from "component/project/stage/grid/column";

import Page, { defaultPage } from "model/common/page";
import Project from "model/project/project";
import Stage from "model/project/stage/stage";

import stageService from "service/project/stage/stage-service";
import Type from "model/project/stage/type";

interface Setup {
	readonly column: {
		readonly width: number
	};
}

const setup: Setup = {
	column: {
		width: 320
	}
};

interface State {
	readonly page: Page<Stage>;
	readonly ready: boolean;
}

const defaultState: State = {
	page: defaultPage,
	ready: false
};

type Action =
	{ type: "page.load", payload: Page<Stage> } |
	{ type: "page.reload" } |
	{ type: "page.reorder", payload: { source: number, destination: number } }
	;

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "page.load": {
			return {
				...state,
				page: action.payload,
				ready: true
			};
		}
		case "page.reload": {
			return {
				...state,
				ready: false
			};
		}
		case "page.reorder": {
			const content: Stage[] = [...state.page.content];
			const source: Stage = content[action.payload.source];
			content.splice(action.payload.source, 1);
			content.splice(action.payload.destination, 0, source);
			return {
				...state,
				page: {
					...state.page,
					content: content.map((stage: Stage, index: number) => ({
						...stage,
						index
					}))
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
	project: Project,
	onError?: (error: Error) => void,
	onRetrieve?: (page: Page<Stage>) => void
};

function Component({
	project,
	onError,
	onRetrieve
}: Properties) {
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	React.useEffect(() => {
		if (!state.ready) {
			stageService.retrieveByProjectId(project.id, { sort: { "index": "asc" } })
				.then(async (response: Response) => {
					const body: any = await response.json();
					if (!response.ok) {
						const error: { message: string } = body;
						throw new Error(error.message);
					}
					const page: Page<Stage> = body;
					dispatch({ type: "page.load", payload: page });
					onRetrieve?.(page);
				})
				.catch((error: Error) => {
					onError?.(error);
				});
		}
	}, [state.ready]);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<RbdDragDropContext
				onDragEnd={(event: any) => {
					if (event.destination !== undefined && event.destination !== null) {
						switch (event.type) {
							case "stage":
								stageService.update({
									...state.page.content[+event.source.index],
									index: event.destination.index
								})
									.then(async (response: Response) => {
										const body: any = await response.json();
										if (!response.ok) {
											const error: { message: string } = body;
											throw new Error(error.message);
										}
										dispatch({ type: "page.reload" });
									})
									.catch((error: Error) => {
										dispatch({ type: "page.reload" });
										onError?.(error);
									});
								dispatch({
									type: "page.reorder",
									payload: {
										source: event.source.index,
										destination: event.destination.index
									}
								});
							case "issue":
								console.log(event);
							// return dispatch({
							// 	type: "project.issue.move",
							// 	payload: {
							// 		issueId: +event.draggableId,
							// 		sourceStageId: +event.source.droppableId,
							// 		sourceIssueIndex: event.source.index,
							// 		destinationStageId: +event.destination.droppableId,
							// 		destinationIssueIndex: event.destination.index
							// 	}
							// });
						}
					}
				}}
			>
				<Droppable droppableId={`droppable-project-${project.id}`} direction="horizontal" type="stage">
					{(provided: any) => (
						<MuiImageList gap={0} ref={provided.innerRef} sx={{
							gridAutoColumns: `${setup.column.width}px`,
							gridAutoFlow: "column",
							gridTemplateColumns: `repeat(auto-fill, ${setup.column.width}px) !important`,
							marginTop: 0,
							minHeight: "100vh",
							paddingLeft: 2
						}} {...provided.droppableProps}>
							{state.page.content.map((stage: Stage) => (
								<RbdDraggable
									isDragDisabled={1 !== project.leader.id}
									draggableId={`draggable-stage-${stage.id}`}
									index={stage.index}
									key={`draggable-stage-${stage.id}`}
								>
									{provided => (
										<MuiImageListItem
											ref={provided.innerRef}
											sx={{
												paddingRight: 2,
												width: "100%"
											}}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										>
											<Droppable droppableId={`droppable-stage-${stage.id}`} type="issue">
												{provided => (
													<StageGridColumn key={`droppable-stage-${stage.id}`} provided={provided} value={stage} />
												)}
											</Droppable>
										</MuiImageListItem>
									)}
								</RbdDraggable>
							))}
							{provided.placeholder}
						</MuiImageList>
					)}
				</Droppable>
			</RbdDragDropContext>
		</Context.Provider>
	);
}

export type StageGridSetup = Setup;
export type StageGridState = State;
export type StageGridAction = Action;
export type StageGridContextValue = ContextValue;
export type StageGridProperties = Properties;
export const StageGrid = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default StageGrid;
