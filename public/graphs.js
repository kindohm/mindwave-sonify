class Graphs {
    constructor(doc, canvasNames, colors) {

        this.contexts = {};
        this.x = 0;
        this.inc = 5;
        this.width = 0;
        this.height = 0;

        var color = 0;
        canvasNames.forEach(name => {
            var canvas = doc.getElementById(name);
            this.width = canvas.width;
            this.height = canvas.height;
            var context = canvas.getContext('2d');
            context.beginPath();
            context.strokeStyle = colors[color];
            context.moveTo(0, this.height);
            this.contexts[name] = context;
            color++;
        });


    }

    drawValues(modulations) {
        var types = Object.keys(modulations);

        this.x += this.inc;

        types.forEach(key => {
            var context = this.contexts[key];
    
            var value = modulations[key];
            var y = this.height - this.height * value;
            context.lineTo(this.x, y);
            context.stroke();
    
            if (this.x >= this.width) {
                context.clearRect(0, 0, this.width, this.height);
                context.moveTo(0, this.height);
                context.beginPath();
            }

    });

        if (this.x > this.width) this.x = 0;
    }
}

