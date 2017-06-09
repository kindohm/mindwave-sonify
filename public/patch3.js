class Patch3 {
    constructor(audioContext, analyzer) {
        this.playing = false;
        this.modTime = 1;
        this.audioContext = audioContext;
        this.nodes = [];
        this.oscHash = {};

        this.types = ['triangle', 'sine'];
        this.fmTypes = ['triangle', 'sine', 'sawtooth', 'square', 'square'];
        this.type = 0;
        this.fmType = 0;
        this.fmType2 = 0;
        this.fmType3 = 0;

        this.durationScales = [25, 50, 30, 70, 20, 15, 20, 10];
        this.durationScale = 0;

        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 1;
        this.masterGain.connect(analyzer);

        this.modulate = this.modulate.bind(this);
        this.currentAttention = 0;
        this.currentMeditation = 0;
    }

    start() {
        this.masterGain.gain.value = 1;
        this.playing = true;
    }

    stop() {
        this.masterGain.gain.value = 0;
    }

    setAttention(data) {
        this.currentAttention = data;
    }

    setMeditation(data) {
        this.currentMeditation = data;
    }

    modulate(params) {
        if (!this.playing) return;
        this.createNodes(this.currentAttention / 100, params.midGamma, params.hiAlpha, params.loAlpha, params.loGamma, params.hiBeta, params.loBeta, params.theta);
    }

    createNodes(quantityFactor, timeFactor, freqFactor, fmFreqFactor, fmFreqFactor2, fmFreqFactor3, fmFreqFactor4, someFactor) {

        var quantity = Math.floor(quantityFactor * 10);
        for (var i = 0; i < quantity; i++) {
            let osc = this.audioContext.createOscillator();

            osc.type = this.types[this.type];
            osc.frequency.value = this.getFreq(freqFactor);

            let duration = this.getDuration(timeFactor);
            let startTime = this.getStartTime(timeFactor);
            let amp = this.audioContext.createGain();
            amp.gain.value = 0.35;
            amp.gain.setTargetAtTime(0, this.audioContext.currentTime + startTime, duration / 4);

            let vibrato1 = this.audioContext.createGain();
            vibrato1.gain.value = 20 * this.currentAttention;
            vibrato1.connect(osc.detune);

            let lfo1 = this.audioContext.createOscillator();
            lfo1.type = this.fmTypes[this.fmType];
            lfo1.connect(vibrato1);
            lfo1.frequency.value = this.getFmFreq(fmFreqFactor);;

            let vibrato2 = this.audioContext.createGain();
            vibrato2.gain.value = 20 * this.currentMeditation;
            vibrato2.connect(lfo1.detune);

            let lfo2 = this.audioContext.createOscillator();
            lfo2.type = this.fmTypes[this.fmType2];
            lfo2.connect(vibrato2);
            lfo2.frequency.value = this.getFmFreq2(fmFreqFactor2);;

            let vibrato3 = this.audioContext.createGain();
            vibrato3.gain.value = 20 * this.currentAttention;
            vibrato3.connect(lfo2.detune);

            let lfo3 = this.audioContext.createOscillator();
            lfo3.type = this.fmTypes[this.fmType3];
            lfo3.connect(vibrato3);
            lfo3.frequency.value = this.getFmFreq3(fmFreqFactor3);;

            let pan = this.audioContext.createStereoPanner();
            pan.pan.value = this.getRandomInt(0, 2) - 1;

            amp.connect(pan);
            pan.connect(this.masterGain);
            osc.connect(amp);

            osc.start(this.audioContext.currentTime + startTime);
            lfo1.start(this.audioContext.currentTime + startTime);
            lfo2.start(this.audioContext.currentTime + startTime);
            lfo3.start(this.audioContext.currentTime + startTime);
            osc.stop(this.audioContext.currentTime + startTime + duration);
            lfo1.stop(this.audioContext.currentTime + startTime + duration);
            lfo2.stop(this.audioContext.currentTime + startTime + duration);
            lfo3.stop(this.audioContext.currentTime + startTime + duration);
        }

    }

    change() {

        this.type = this.getRandomInt(0, this.types.length - 1);
        this.fmType = this.getRandomInt(0, this.fmTypes.length - 1);
        this.fmType2 = this.getRandomInt(0, this.fmTypes.length - 1);
        this.fmType3 = this.getRandomInt(0, this.fmTypes.length - 1);
        this.durationScale = this.getRandomInt(0, this.durationScales.length - 1);
    }

    getFreq(freqFactor) {
        return this.getRandomInt(40 * freqFactor, 2000 * freqFactor);
    }

    getFmFreq(fmFreqFactor) {
        return this.getRandomInt(3 * fmFreqFactor, 10000 * fmFreqFactor);
    }

    getFmFreq2(fmFreqFactor) {
        return this.getRandomInt(1 * fmFreqFactor, 200 * fmFreqFactor);
    }

    getFmFreq3(fmFreqFactor) {
        return this.getRandomInt(1 * fmFreqFactor, 100 * fmFreqFactor);
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
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}
