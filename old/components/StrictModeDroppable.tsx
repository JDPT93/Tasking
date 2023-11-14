import React from "react";

import {
	Droppable,
	DroppableProps
} from "react-beautiful-dnd";

export default function StrictModeDroppable({ children, ...properties }: DroppableProps) {
	const [enabled, setEnabled] = React.useState(false);
	React.useEffect(() => {
		const animation = requestAnimationFrame(() => setEnabled(true));
		return () => {
			cancelAnimationFrame(animation);
			setEnabled(false);
		};
	}, []);
	return enabled ? <Droppable {...properties}>{children}</Droppable> : null;
}