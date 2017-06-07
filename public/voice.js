class Voice {
    constructor(audioContext, analyzer) {
        this.audioContext = audioContext;
        this.started = false;
        this.analyzer = analyzer;

        // this.patches = [Patch2];
        this.patch = new Patch2(this.audioContext,this.analyzer);
        // this.patchIndex = -1;
        // this.changePatch();
    }

    changePatch() {
        // this.patchIndex++;
        // if (this.patchIndex >= this.patches.length) this.patchIndex = 0;

        // if (!this.patch) {
        //     //if (this.started) this.patch.stop();
        //     this.patch = new this.patches[this.patchIndex](this.audioContext, this.analyzer);
        //     // if (this.started) this.patch.start();
        // }

        if (this.patch) this.patch.change();
    }

    start() {
        if (this.started) {
            console.warn('tried to start a patch that has already been started.');
        }

        this.patch.start();
        this.started = true;
    }

    modulate(modulation) {
        this.patch.modulate(modulation);
    }

    stop() {
        if (!this.started) return;
        this.patch.stop();
    }
}
