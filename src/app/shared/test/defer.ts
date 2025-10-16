import { ComponentFixture, DeferBlockState } from '@angular/core/testing';

export const renderAllDeferBlocks = async <T>(
    fixture: ComponentFixture<T>
): Promise<void[]> => {
    const blocks = await fixture.getDeferBlocks();
    const renderAll = blocks.map((x) => x.render(DeferBlockState.Complete));
    return Promise.all(renderAll);
};
