/**
* Controls the UI elements and manages interactions for the run tracking application
* @class
*/
export class UIController {
    /**
    * Creates a new UIController instance
    * @param {RunTracker} runTracker - The run tracker instance to manage
    * @throws {Error} If required UI elements are not found
    */
    constructor(runTracker) {
        if (!runTracker) {
            throw new Error('RunTracker instance is required');
        }
        this.runTracker = runTracker;
        this.elements = this.initializeElements();
        this._boundHandleTrackerUpdate = this.handleTrackerUpdate.bind(this);
    }

    /**
    * Initializes and validates all required UI elements
    * @private
    * @returns {Object} Object containing all UI element references
    * @throws {Error} If any required element is missing
    */
    initializeElements() {
        const elements = {
            timer: document.getElementById('timer'),
            distance: document.getElementById('distance'),
            speed: document.getElementById('speed'),
            nftPoints: document.getElementById('nft-points'),
            startBtn: document.getElementById('start-btn'),
            stopBtn: document.getElementById('stop-btn'),
            nextReward: document.getElementById('next-reward'),
            rewardMessage: document.getElementById('reward-message')
        };

        Object.entries(elements).forEach(([key, element]) => {
            if (!element) {
                throw new Error(`Required UI element not found: ${key}`);
            }
        });

        return elements;
    }

    /**
    * Initializes the UI controller
    * @public
    * @returns {Promise<void>}
    */
    async initialize() {
        try {
            this.setupEventListeners();
            this.runTracker.subscribe(this._boundHandleTrackerUpdate);
            await this.resetUI();
        } catch (error) {
            console.error('UI initialization failed:', error);
            this.showError('Failed to initialize application');
            throw error;
        }
    }

    /**
    * Sets up event listeners for UI elements
    * @private
    */
    setupEventListeners() {
        this.elements.startBtn.addEventListener('click', this.handleStartClick.bind(this));
        this.elements.stopBtn.addEventListener('click', this.handleStopClick.bind(this));
    }

    /**
    * Handles the start button click event
    * @private
    * @async
    */
    async handleStartClick() {
        try {
            this.elements.startBtn.disabled = true;
            const success = await this.runTracker.startRun();
            if (success) {
                this.elements.stopBtn.disabled = false;
            } else {
                this.elements.startBtn.disabled = false;
                this.showError('Failed to start run');
            }
        } catch (error) {
            console.error('Start run failed:', error);
            this.elements.startBtn.disabled = false;
            this.showError('Failed to start run');
        }
    }

    /**
    * Handles the stop button click event
    * @private
    */
    handleStopClick() {
        try {
            this.runTracker.stopRun();
            this.elements.startBtn.disabled = false;
            this.elements.stopBtn.disabled = true;
        } catch (error) {
            console.error('Stop run failed:', error);
            this.showError('Failed to stop run');
        }
    }

    /**
    * Resets the UI to its initial state
    * @private
    * @returns {Promise<void>}
    */
    async resetUI() {
        Object.values(this.elements).forEach(element => {
            if (element.tagName === 'BUTTON') {
                element.disabled = false;
            } else {
                element.textContent = element.id === 'timer' ? '00:00:00' : '0';
            }
        });
    }

    /**
    * Cleans up the controller, removing event listeners
    * @public
    */
    cleanup() {
        this.runTracker.unsubscribe(this._boundHandleTrackerUpdate);
    }
}
