class Voice {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.started = false;

        this.patches = [Patch, Patch2];
        this.patchIndex = -1;
        this.changePatch();
    }

    changePatch(){
        this.patchIndex++;
        if (this.patchIndex >= this.patches.length) this.patchIndex = 0;

        if (this.started) this.patch.stop();
        this.patch = new this.patches[this.patchIndex](this.audioContext);
        if (this.started) this.patch.start();
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
