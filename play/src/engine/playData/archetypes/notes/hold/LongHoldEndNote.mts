import { Layer } from "$shared/data/layer.mjs";
import { buckets } from "../../../buckets.mjs";
import { note } from "../../../note.mjs";
import { particle } from "../../../particle.mjs";
import { skin } from "../../../skin.mjs";
import { getZ } from "../../../util.mjs";
import { HoldEndNote } from "./HoldEndNote.mjs";

export class LongHoldEndNote extends HoldEndNote {
	bucket = buckets.longHoldEnd;
	effect = particle.effects.longHold;

	indicator = this.entityMemory({
		backgroundZ: Number,
		foregroundZ: Number,
	});

	globalPreprocess(): void {
		super.globalPreprocess();

		note.longHoldBarSprite = skin.sprites.longHoldBar.id;
		if (!skin.sprites.exists(note.longHoldBarSprite)) note.longHoldBarSprite = skin.sprites.longHoldBarFallback.id;
	}

	preprocess(): void {
		super.preprocess();

		this.sprite = skin.sprites.longHold.id;
		if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.longHoldFallback.id;

		this.indicator.backgroundZ = getZ(Layer.HOLD_INDICATOR_BACK, this.times.target);
		this.indicator.foregroundZ = getZ(Layer.HOLD_INDICATOR_FORE, this.times.target);
	}

	draw(): void {
		super.draw();

		// Draw hold indicator
		if (this.startInfo.state !== EntityState.Despawned) return;

		const layout = Rect.one.scale(note.indicatorRadius, note.indicatorRadius).translate(this.pos.x, this.pos.y);

		// Background
		skin.sprites.holdIndicatorBackground.draw(layout, this.indicator.backgroundZ, 1);

		// Bar at the top
		skin.sprites.longHoldIndicator.draw(layout, this.indicator.foregroundZ, 1);

		const progress = Math.unlerp(this.times.target, this.startTarget, time.now);
		const rotated = Quad.one
			.scale(note.indicatorRadius, note.indicatorRadius)
			.rotate(progress * note.indicatorDegree)
			.translate(this.pos.x, this.pos.y);

		skin.sprites.longHoldIndicator.draw(rotated, this.indicator.foregroundZ, 1);
	}

	drawBar(): void {
		const alpha = Math.min(1, Math.unlerp(this.times.alpha.start, this.times.alpha.end, time.now));
		const scale =
			time.now <= this.startTarget
				? Math.unlerp(this.times.scale.start, this.times.scale.end, time.now)
				: Math.unlerp(this.times.target, this.startTarget, time.now);

		const layout = Rect.one.scale(note.longHoldBar * scale, 1).translate(this.pos.x, 0);

		skin.sprites.draw(note.longHoldBarSprite, layout, this.bar.z, alpha);
	}
}
