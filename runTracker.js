export class RunTracker {
constructor(map) {
    this.map = map;
    this.timer = 0;
    this.isRunning = false;
    this.intervalId = null;
    this.currentPath = [];
    this.totalDistance = 0;
    this.nftPoints = 0;
    this.nextRewardDistance = 5.0;
    this.callbacks = new Set();
    this.debouncedUpdateMap = _.debounce(this.updateMap.bind(this), 1000);
}

subscribe(callback) {
    this.callbacks.add(callback);
}

unsubscribe(callback) {
    this.callbacks.delete(callback);
}

notifySubscribers(data) {
    this.callbacks.forEach(callback => callback(data));
}

async startRun() {
    try {
    if (!("geolocation" in navigator)) {
        throw new Error("Geolocation not supported");
    }

    this.isRunning = true;
    this.startTimer();
    this.startTracking();

    return true;
    } catch (error) {
    console.error('Failed to start run:', error);
    return false;
    }
}

stopRun() {
    this.isRunning = false;
    this.stopTimer();
    this.notifySubscribers({
    type: 'runComplete',
    distance: this.totalDistance,
    nftPoints: this.nftPoints
    });
}

startTracking() {
    navigator.geolocation.watchPosition(
    this.handlePosition.bind(this),
    this.handleError.bind(this),
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
    );
}

handlePosition(position) {
    try {
    const newPos = [position.coords.latitude, position.coords.longitude];
    this.currentPath.push(newPos);
    this.debouncedUpdateMap();
    
    if (this.currentPath.length > 1) {
        this.updateStats(position.coords.speed || 0);
    }
    } catch (error) {
    console.error('Error handling position:', error);
    }
}

updateMap() {
    this.map.updateRoute(this.currentPath);
    this.map.setView(this.currentPath[this.currentPath.length - 1]);
}

handleError(error) {
    console.error('Geolocation error:', error);
    this.notifySubscribers({
    type: 'error',
    message: 'Failed to get location'
    });
}

startTimer() {
    this.intervalId = setInterval(() => {
    this.timer++;
    this.notifySubscribers({
        type: 'timerUpdate',
        time: this.timer
    });
    }, 1000);
}

stopTimer() {
    if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
    }
}

updateStats(speed) {
    if (this.currentPath.length < 2) return;

    const lastTwo = this.currentPath.slice(-2);
    const increment = this.map.calculateDistance(lastTwo[0], lastTwo[1]) / 1000;
    this.totalDistance += increment;

    this.notifySubscribers({
    type: 'statsUpdate',
    speed: speed * 3.6,
    distance: this.totalDistance
    });

    this.checkNFTReward();
}

checkNFTReward() {
    if (this.totalDistance >= this.nextRewardDistance) {
    this.nftPoints += Math.floor(this.totalDistance / 5);
    this.nextRewardDistance += 5.0;
    
    this.notifySubscribers({
        type: 'nftReward',
        points: this.nftPoints,
        nextReward: this.nextRewardDistance
    });
    }
}
}

