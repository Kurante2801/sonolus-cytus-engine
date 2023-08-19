import { Layer } from "../../../../../shared/src/engine/data/layer.mjs";
import { getGameplayBounds } from "../../../../../shared/src/engine/data/util.mjs";
import { options } from "../../configuration/options.mjs";
import { scanline } from "../scanline.mjs";
import { skin } from "../skin.mjs";

export class Stage extends Archetype {
	globalPreprocess(): void {
		scanline.bounds.copyFrom(
			getGameplayBounds(screen.w, screen.h, options.horizontalMargin, options.verticalMargin),
		);
	}

	spawnOrder(): number {
		return 1;
	}

	shouldSpawn(): boolean {
		return entityInfos.get(0).state === EntityState.Despawned;
	}

	preprocess(): void {
		// Hide scanline until level starts
		scanline.y = 1 + scanline.thick;
	}

	updateParallel(): void {
		const layout = Rect.one.scale(screen.w, scanline.thick).translate(0, scanline.y);
		skin.sprites.judgment.draw(layout, Layer.JUDGMENT, 1);
	}
}
