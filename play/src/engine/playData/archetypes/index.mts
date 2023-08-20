import { DragSegment } from "./DragSegment.mjs";
import { Initialization } from "./Initialization.mjs";
import { ScanlineCommand } from "./ScanlineCommand.mjs";
import { Stage } from "./Stage.mjs";
import { FlickNote } from "./notes/FlickNote.mjs";
import { TapNote } from "./notes/TapNote.mjs";
import { DragNote } from "./notes/drag/DragNote.mjs";
import { DragTapChildNote } from "./notes/drag/DragTapChildNote.mjs";

export const archetypes = defineArchetypes({
	Initialization,
	Stage,
	ScanlineCommand,

	TapNote,
	FlickNote,

	DragNote,
	DragTapChildNote,
	DragSegment,
});
