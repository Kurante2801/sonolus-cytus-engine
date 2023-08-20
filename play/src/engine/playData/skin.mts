import { SkinSpriteName } from "sonolus-core";

export const skin = defineSkin({
	sprites: {
		judgment: SkinSpriteName.JudgmentLine,

		tapUp: "Cytus Tap Up",
		tapDown: "Cytus Tap Down",
		tapFallback: SkinSpriteName.NoteHeadCyan,

		holdUp: "Cytus Hold Up",
		holdDown: "Cytus Hold Down",
		holdFallback: SkinSpriteName.NoteHeadRed,

		holdBar: "Cytus Hold Bar",
		holdBarUp: "Cytus Hold Bar Up",
		holdBarDown: "Cytus Hold Bar Down",
		holdBarFallback: SkinSpriteName.NoteConnectionNeutral,

		longHold: "Cytus Long Hold",
		longHoldFallback: SkinSpriteName.NoteHeadYellow,

		longHoldBar: "Cytus Long Hold Bar",
		longHoldBarFallback: SkinSpriteName.NoteConnectionYellow,

		holdIndicatorBackground: "Cytus Hold Indicator Background",
		//holdIndicatorUp: "Cytus Hold Indicator Up",
		//holdIndicatorDown: "Cytus Hold Indicator Down",
		longHoldIndicator: "Cytus Long Hold Indicator",

		dragHeadUp: "Cytus Drag Up",
		dragHeadDown: "Cytus Drag Down",
		dragHeadFallback: SkinSpriteName.NoteHeadPurple,

		dragChildUp: "Cytus Drag Child Up",
		dragChildDown: "Cytus Drag Child Down",
		dragChildFallback: SkinSpriteName.NoteTickPurple,

		dragTapHeadUp: "Cytus Drag Tap Up",
		dragTapHeadDown: "Cytus Drag Tap Down",
		dragTapHeadFallback: SkinSpriteName.NoteHeadCyan,

		dragTapChildUp: "Cytus Drag Tap Child Up",
		dragTapChildDown: "Cytus Drag Tap Child Down",
		dragTapChildFallback: SkinSpriteName.NoteTickPurple,

		dragArrow: SkinSpriteName.DirectionalMarkerNeutral,
		dragSegment: SkinSpriteName.NoteConnectionNeutralSeamless,

		flickUp: "Cytus Flick Up",
		flickDown: "Cytus Flick Down",
		flickFallback: SkinSpriteName.NoteHeadGreen,

		flickArrow: "Cytus Flick Arrow",
		flickArrowFallback: SkinSpriteName.DirectionalMarkerRed,
	},
});
