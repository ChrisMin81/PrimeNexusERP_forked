import { vi } from 'vitest';

// Provide a minimal canvas context to avoid jsdom "not implemented" errors from chart.js.
HTMLCanvasElement.prototype.getContext = () => ({}) as RenderingContext;

// Stub chart.js to prevent it from trying to access real canvas APIs in jsdom.
class ChartMock {
    destroy() {}
    update() {}
    resize() {}
}

vi.mock('chart.js/auto', () => ({
    default: ChartMock
}));
vi.mock('chart.js', () => ({
    default: ChartMock
}));
