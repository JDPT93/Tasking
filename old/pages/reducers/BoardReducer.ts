import Project from "../../schemas/Project";

export interface BoardState {
  project?: Project
  ready: boolean;
}

export type BoardAction
  = { type: "ready.toggle" }
  | { type: "project.set", payload: Project }
  | {
    type: "project.stage.move",
    payload: {
      stageId: number,
      sourceStageIndex: number,
      destinationStageIndex: number
    }
  }
  | {
    type: "project.issue.move", payload: {
      issueId: number,
      sourceStageId: number,
      sourceIssueIndex: number,
      destinationStageId: number,
      destinationIssueIndex: number
    }
  }
  ;

export function BoardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    default:
      throw new TypeError("Unexpected action type");
    case "ready.toggle":
      return {
        ...state,
        ready: !state.ready
      };
    case "project.set":
      return {
        ...state,
        project: action.payload
      };
    case "project.stage.move": {
      if (state.project === undefined) {
        return state;
      }
      const { stageId, sourceStageIndex, destinationStageIndex } = action.payload;
      const maximum = Math.max(sourceStageIndex, destinationStageIndex);
      const minimum = Math.min(sourceStageIndex, destinationStageIndex);
      const direction = Math.sign(destinationStageIndex - sourceStageIndex);
      // console.log(action.payload, state.project.stages, state.project.stages.map(stage => ({
      //   ...stage,
      //   index: stage.id === stageId
      //     ? destinationStageIndex
      //     : stage.index >= minimum && stage.index <= maximum
      //       ? stage.index - direction
      //       : stage.index
      // })));
      return {
        ...state,
        project: {
          ...state.project,
          stages: state.project.stages.map(stage => ({
            ...stage,
            index: stage.id === stageId
              ? destinationStageIndex
              : stage.index >= minimum && stage.index <= maximum
                ? stage.index - direction
                : stage.index
          }))
        }
      };
    }
    case "project.issue.move": {
      if (state.project === undefined) {
        return state;
      }
      const stages = [...state.project.stages];
      const { issueId, sourceStageId, sourceIssueIndex, destinationStageId, destinationIssueIndex } = action.payload;
      const destinationStageIndex = stages.findIndex(stage => stage.id === destinationStageId);
      if (sourceStageId === destinationStageId) {
        const maximum = Math.max(sourceIssueIndex, destinationIssueIndex);
        const minimum = Math.min(sourceIssueIndex, destinationIssueIndex);
        const direction = Math.sign(destinationIssueIndex - sourceIssueIndex);
        stages[destinationStageIndex] = {
          ...stages[destinationStageIndex],
          issues: stages[destinationStageIndex].issues.map(issue => ({
            ...issue,
            index: issue.id === issueId
              ? destinationIssueIndex
              : issue.index >= minimum && issue.index <= maximum
                ? issue.index - direction
                : issue.index
          }))
        };
      } else {
        const sourceStageIndex = stages.findIndex(stage => stage.id === sourceStageId);
        stages[destinationStageIndex] = {
          ...stages[destinationStageIndex],
          issues: [
            ...stages[destinationStageIndex].issues.map(issue => ({
              ...issue,
              index: issue.index < destinationIssueIndex ? issue.index : issue.index + 1
            })),
            {
              ...stages[sourceStageIndex].issues.find(issue => issue.id === issueId)!,
              index: destinationIssueIndex
            }
          ]
        };
        stages[sourceStageIndex] = {
          ...stages[sourceStageIndex],
          issues: stages[sourceStageIndex].issues.filter(issue => issue.id !== issueId)
        };
      }
      return {
        ...state,
        project: {
          ...state.project,
          stages
        }
      };
    }
  }
}

export default BoardReducer;

 // const stages = [...project.stages];

// const sourceStageId = +event.source.droppableId;
// const sourceStageIndex = stages.findIndex(stage => stage.id === sourceStageId);

// const destinationStageId = +event.destination.droppableId;
// const destinationStageIndex = stages.findIndex(stage => stage.id === destinationStageId);

// const issueId = +event.draggableId;
// const sourceIssueIndex = +event.source.index;
// const destinationIssueIndex = event.destination.index;



// if (destinationStageId !== sourceStageId) {

// } else {
//
// }
// console.log(project.stages)
// setProject({
//   ...project,
//   stages
// });
// console.log(stages)