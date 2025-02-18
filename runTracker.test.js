import { RunTracker } from './runTracker.js';
import { jest } from '@jest/globals';

describe('RunTracker', () => {
    let runTracker;
    let mockMap;
    let mockGeolocation;

    beforeEach(() => {
        // Mock map implementation
        mockMap = {
            updateRoute: jest.fn(),
            setView: jest.fn(),
            calculateDistance: jest.fn().mockReturnValue(100)
        };

        // Mock geolocation
        mockGeolocation = {
            watchPosition: jest.fn((success) => {
                success({
                    coords: {
                        latitude: 0,
                        longitude: 0,
                        speed: 10
                    }
                });
                return 123; // watchPosition ID
            })
        };

        global.navigator.geolocation = mockGeolocation;
        runTracker = new RunTracker(mockMap);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('startRun', () => {
        test('should start tracking when geolocation is available', async () => {
            const result = await runTracker.startRun();
            expect(result).toBe(true);
            expect(runTracker.isRunning).toBe(true);
            expect(mockGeolocation.watchPosition).toHaveBeenCalled();
        });

        test('should fail when geolocation is not available', async () => {
            global.navigator.geolocation = undefined;
            const result = await runTracker.startRun();
            expect(result).toBe(false);
            expect(runTracker.isRunning).toBe(false);
        });
    });

    describe('stopRun', () => {
        test('should stop tracking and notify subscribers', () => {
            const mockCallback = jest.fn();
            runTracker.subscribe(mockCallback);
            runTracker.startRun();
            runTracker.stopRun();

            expect(runTracker.isRunning).toBe(false);
            expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({
                type: 'runComplete'
            }));
        });
    });

    describe('handlePosition', () => {
        test('should update path and calculate stats', () => {
            const mockCallback = jest.fn();
            runTracker.subscribe(mockCallback);
            
            runTracker.handlePosition({
                coords: {
                    latitude: 1,
                    longitude: 1,
                    speed: 5
                }
            });

            expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({
                type: 'statsUpdate'
            }));
        });
    });

    describe('checkNFTReward', () => {
        test('should award NFT points at distance milestones', () => {
            const mockCallback = jest.fn();
            runTracker.subscribe(mockCallback);
            runTracker.totalDistance = 5.0;
            
            runTracker.checkNFTReward();

            expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({
                type: 'nftReward',
                points: expect.any(Number)
            }));
        });
    });
});

