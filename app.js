import { initMap } from './map.js';
import { RunTracker } from './runTracker.js';
import { UIController } from './uiController.js';

async function initializeApp() {
try {
    const map = await initMap();
    if (!map) {
    throw new Error('Failed to initialize map');
    }

    const runTracker = new RunTracker(map);
    const ui = new UIController(runTracker);
    
    await ui.initialize();
    
    console.log('Application initialized successfully');
} catch (error) {
    console.error('Critical error initializing application:', error);
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = 'Failed to load application. Please refresh the page.';
    document.body.prepend(errorElement);
}
}

initializeApp();

