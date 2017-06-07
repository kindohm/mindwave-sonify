class Patch {
    constructor(audioContext, analyzer) {
        this.modTime = 1;
        this.audioContext = audioContext;

        let osc1 = audioContext.createOscillator();
        osc1.connect(analyzer);
        osc1.type = 'triangle';
        osc1.frequency.value = 400;

        let vibrato1 = audioContext.createGain();
        vibrato1.gain.value = 100;
        vibrato1.connect(osc1.detune);

        let lfo1 = audioContext.createOscillator()
        lfo1.connect(vibrato1)
        lfo1.frequency.value = 0.1;

        let vibrato2 = audioContext.createGain()
        vibrato2.gain.value = 100;
        vibrato2.connect(lfo1.detune);

        let lfo2 = audioContext.createOscillator()
        lfo2.connect(vibrato2);
        lfo2.frequency.value = 50;

        this.nodes = [osc1, lfo1, lfo2];
        this.osc1 = osc1;
        this.lfo1 = lfo1;
        this.lfo2 = lfo2;
        this.vibrato1 = vibrato1;
        this.vibrato2 = vibrato2;
        this.modulate = this.modulate.bind(this);
    }

    start() {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].start(this.audioContext.currentTime);
        }
    }

    stop() {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].stop(this.audioContext.currentTime);
        }
    }

    modulate(params) {
        this.osc1.frequency.linearRampToValueAtTime(60 + 400 * params.loAlpha, this.audioContext.currentTime + this.modTime);
        this.vibrato1.gain.linearRampToValueAtTime(params.loBeta * 2000, this.audioContext.currentTime + this.modTime)
        this.vibrato2.gain.linearRampToValueAtTime(params.midGamma * 1500, this.audioContext.currentTime + this.modTime)
        this.lfo1.frequency.linearRampToValueAtTime(20 * params.loGamma, this.audioContext.currentTime + this.modTime);
        this.lfo2.frequency.linearRampToValueAtTime(20 * params.hiBeta, this.audioContext.currentTime + this.modTime);
    }
}
