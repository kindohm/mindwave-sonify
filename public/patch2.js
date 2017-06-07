class Patch2 {
    constructor(audioContext, analyzer) {
        this.playing = false;
        this.modTime = 1;
        this.audioContext = audioContext;
        this.nodes = [];
        this.oscHash = {};

        this.types = ['triangle', 'sine', 'sawtooth', 'square'];
        this.type = 0;
        this.fmType = 0;

        this.durationScales = [250, 500, 300, 700, 200, 1500, 2000, 1000];
        this.durationScale = 0;

        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 1;
        this.masterGain.connect(analyzer);

        this.modulate = this.modulate.bind(this);
    }

    start() {
        this.masterGain.gain.value = 1;
        this.playing = true;
    }

    stop() {
        this.masterGain.gain.value = 0;
        // this.playing = false;
    }

    modulate(params) {
        if (!this.playing) return;
        this.createNodes(params.hiBeta, params.midGamma, params.hiAlpha, params.loAlpha);
    }

    createNodes(quantityFactor, timeFactor, freqFactor, fmFreqFactor) {

        var quantity = Math.floor(quantityFactor * 25);
        for (var i = 0; i < quantity; i++) {
            let osc = this.audioContext.createOscillator();

            osc.type = this.types[this.type];
            osc.frequency.value = this.getFreq(freqFactor);

            let duration = this.getDuration(timeFactor);
            let startTime = this.getStartTime(timeFactor);
            let amp = this.audioContext.createGain();
            amp.gain.value = 1;
            amp.gain.setTargetAtTime(0, this.audioContext.currentTime + startTime, duration / 4);

            let vibrato1 = this.audioContext.createGain();
            vibrato1.gain.value = 2000;
            vibrato1.connect(osc.detune);

            let lfo1 = this.audioContext.createOscillator();
            lfo1.type = this.types[this.fmType];
            lfo1.connect(vibrato1);
            lfo1.frequency.value = this.getFmFreq(fmFreqFactor);;

            let pan = this.audioContext.createStereoPanner();
            pan.pan.value = this.getRandomInt(0, 2) - 1;

            amp.connect(pan);
            pan.connect(this.masterGain);
            osc.connect(amp);

            osc.start(this.audioContext.currentTime + startTime);
            lfo1.start(this.audioContext.currentTime + startTime);
            osc.stop(this.audioContext.currentTime + startTime + duration);
            lfo1.stop(this.audioContext.currentTime + startTime + duration);
        }

    }

    change() {

        this.type = this.getRandomInt(0, this.types.length - 1);
        this.fmType = this.getRandomInt(0, this.types.length - 1);
        this.durationScale = this.getRandomInt(0, this.durationScales.length - 1);

        // if (this.type + 1 >= this.types.length) {
        //     this.type = 0;
        // }
        // else {
        //     this.type += 1;
        // }

        // if (this.durationScale + 1 >= this.durationScales.length) {
        //     this.durationScale = 0;
        // } else {
        //     this.durationScale += 1;
        // }


    }

    getFreq(freqFactor) {
        return this.getRandomInt(40 * freqFactor, 10000 * freqFactor);
    }

    getFmFreq(fmFreqFactor) {
        return this.getRandomInt(10 * fmFreqFactor, 10000 * fmFreqFactor);
    }

    getStartTime(timeFactor) {
        return this.getRandomInt(10 * timeFactor, 10000 * timeFactor) / 1000;
    }

    getDuration(timeFactor) {
        return this.getRandomInt(10 * timeFactor, 100 * timeFactor) / this.durationScales[this.durationScale];
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

}
