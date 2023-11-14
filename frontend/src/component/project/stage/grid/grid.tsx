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
	{ type: "page.reload" }
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
							// return dispatch({
							// 	type: "project.stage.move",
							// 	payload: {
							// 		stageId: +event.draggableId,
							// 		sourceStageIndex: event.source.index,
							// 		destinationStageIndex: event.destination.index
							// 	}
							// });
							case "issue":
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
				<Droppable droppableId="canva" direction="horizontal" type="stage">
					{provider => (
						<MuiImageList gap={0} ref={provider.innerRef} sx={{
							gridAutoColumns: `${setup.column.width}px`,
							gridAutoFlow: "column",
							gridTemplateColumns: `repeat(auto-fill, ${setup.column.width}px) !important`,
							marginTop: 0,
							minHeight: "100vh",
							paddingLeft: 2
						}} {...provider.droppableProps}>
							{state.page.content.map(stage => (
								<RbdDraggable
									key={stage.id.toString()}
									draggableId={"+".concat(stage.id.toString())}
									index={stage.index}
								>
									{provider => (
										<MuiImageListItem
											ref={provider.innerRef}
											sx={{
												paddingRight: 2,
												width: "100%"
											}}
											{...provider.draggableProps}
											{...provider.dragHandleProps}
										>
											<StageGridColumn key={stage.id.toString()} value={stage} />
										</MuiImageListItem>
									)}
								</RbdDraggable>
							))}
							{provider.placeholder}
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
