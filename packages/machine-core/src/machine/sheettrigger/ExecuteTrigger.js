const AbstractStreamSheetTrigger = require('./AbstractStreamSheetTrigger');

const TYPE_CONF = { type: 'execute' };

class ExecuteTrigger extends AbstractStreamSheetTrigger {
	static get TYPE() {
		return TYPE_CONF.type;
	}
	constructor(cfg = {}) {
		super(Object.assign(cfg, TYPE_CONF));
		this._repetitions = 1;
		this._isExecuted = false;
		this._callingSheet = undefined;
	}

	// use did step to support trigger on manual steps
	postStep(manual) {
		super.postStep(manual);
		this._isExecuted = false;
	}

	execute(repetitions, callingSheet) {
		this.isActive = true;
		this._repetitions = Math.max(1, repetitions);
		this._isExecuted = true;
		this._callingSheet = callingSheet;
		if (this.isEndless) callingSheet.pauseProcessing();
		this.trigger();
	}

	step(manual) {
		if (manual && this.isEndless && !this._isExecuted) { // && this.isActive) {
			this.doRepeatStep();
		}
	}

	doCycleStep() {
		this._streamsheet.stats.steps += 1;
		this._doExecute();
	}
	doRepeatStep() {
		this._streamsheet.stats.repeatsteps += 1;
		this._doExecute();
	}
	_doExecute() {
		if (!this.isResumed) {
			const streamsheet = this._streamsheet;
			for (let i = 0; this.isActive && i < this._repetitions; i += 1) {
				streamsheet.stats.executesteps = i + 1;
				streamsheet.triggerStep();
			}
			streamsheet.stats.executesteps = 0;
		}
	}

	stop() {
		this.isActive = false;
		this._isExecuted = false;
		return super.stop();
	}
	stopProcessing() {
		super.stopProcessing();
		// resume calling sheet only in endless mode, otherwise it wasn't paused
		if (this.isEndless && this._callingSheet) this._callingSheet.resumeProcessing();
	}

	update(config = {}) {
		if (this.isEndless && config.repeat !== 'endless') this.stopProcessing();
		super.update(config);
	}

}
module.exports = ExecuteTrigger;
