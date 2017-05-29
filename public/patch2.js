class Patch2 {
    constructor(audioContext) {
        this.modTime = 1;

        this.audioContext = audioContext;


        this.types = ['delta', 'theta', 'hiAlpha', 'loAlpha', 'hiBeta', 'loBeta', 'loGamma', 'midGamma'];
        this.nodes = [];
        this.oscHash = {};

        this.types.forEach(type => {
            var osc = audioContext.createOscillator();
            osc.frequency.value = 400;
            osc.type = "triangle";
            osc.connect(audioContext.destination);

            this.nodes.push(osc);
            this.oscHash[type] = osc;

        });

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

        this.types.forEach(type => {
            this.oscHash[type].frequency.linearRampToValueAtTime(this.getScaled(params[type]), this.audioContext.currentTime + this.modTime);
        })



    }

    getScaled(value) {
        return Math.floor(value * 200) + 60;
    }
}
