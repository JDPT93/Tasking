import React from "react";

import { useParams } from "react-router-dom";

import { Box, ImageList, ImageListItem } from "@mui/material";

import { DragDropContext, Draggable } from "react-beautiful-dnd";

import NavigationBar from "../components/NavigationBar";
import StageColumn from "../components/StageColumn";
import StrictModeDroppable from "../components/StrictModeDroppable";

import LocaleContext from "../contexts/LocaleContext";
import ServiceContext from "../contexts/ServiceContext";

import BoardReducer from "./reducers/BoardReducer";

import Project from "../schemas/Project";

import ErrorPage from "./ErrorPage";

interface Properties {
	onError?: (error: Error) => void
}

function BoardPage({ onError }: Properties) {
	const { id } = useParams();
	const [{ project, ready }, dispatch] = React.useReducer(BoardReducer, {
		ready: false
	});
	const locale = React.useContext(LocaleContext);
	const { projectService } = React.useContext(ServiceContext);
	React.useEffect(() => {
		if (id === undefined || Number.isNaN(+id)) {
			return dispatch({ type: "ready.toggle" });
		}
		projectService.retrieveById(+id)
			.then(async response => {
				const body = await response.json();
				if (!response.ok) {
					throw body as Error;
				}
				dispatch({ type: "project.set", payload: body as Project });
				dispatch({ type: "ready.toggle" });
			})
			.catch(error => {
				if (onError !== undefined) {
					onError(error);
				}
				dispatch({ type: "ready.toggle" });
			});
	}, []);
	return (
		<Box>
			{project === undefined
				? ready
					? (
						<ErrorPage code={404} />
					)
					: (
						<Box padding={2}>
							{/* TODO: skeleton */}
						</Box>
					)
				: (
					<Box>
						<NavigationBar project={project} />
						<DragDropContext onDragEnd={event => {
							if (event.destination !== undefined && event.destination !== null) {
								switch (event.type) {
									case "stage":
										return dispatch({
											type: "project.stage.move",
											payload: {
												stageId: +event.draggableId,
												sourceStageIndex: event.source.index,
												destinationStageIndex: event.destination.index
											}
										});
									case "issue":
										return dispatch({
											type: "project.issue.move",
											payload: {
												issueId: +event.draggableId,
												sourceStageId: +event.source.droppableId,
												sourceIssueIndex: event.source.index,
												destinationStageId: +event.destination.droppableId,
												destinationIssueIndex: event.destination.index
											}
										});
								}
							}
						}}>
							<StrictModeDroppable droppableId="canva" direction="horizontal" type="stage">
								{provider => (
									<ImageList gap={0} ref={provider.innerRef} sx={{
										gridAutoColumns: "300px",
										gridAutoFlow: "column",
										gridTemplateColumns: "repeat(auto-fill, 300px) !important",
										marginTop: 0,
										minHeight: "100vh",
										paddingLeft: 2
									}} {...provider.droppableProps}>
										{project.stages.sort((left, right) => left.index - right.index).map(stage => (
											<Draggable key={stage.id.toString()} draggableId={"+".concat(stage.id.toString())} index={stage.index}>
												{provider => (
													<ImageListItem ref={provider.innerRef} sx={{ paddingRight: 2 }} {...provider.draggableProps} {...provider.dragHandleProps} >
														<StageColumn key={stage.id.toString()} stage={stage} />
													</ImageListItem>
												)}
											</Draggable>
										))}
										{provider.placeholder}
									</ImageList>
								)}
							</StrictModeDroppable>
						</DragDropContext>
					</Box>
				)
			}
		</Box>
	);
}

export default BoardPage;
