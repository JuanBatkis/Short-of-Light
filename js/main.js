let myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1152;
        this.canvas.height = 768;
        this.context = this.canvas.getContext("2d");
        document.getElementById('canvasSection').appendChild(this.canvas);
    },
};

myGameArea.start();