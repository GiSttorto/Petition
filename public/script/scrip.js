(function canvas() {
    var canvas = document.getElementById("canv");
    var ctx = canvas.getContext("2d");
    var hidden = document.getElementById("hidden");
    var signatureString = "";

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function draw(e) {
        if (!isDrawing) return;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    canvas.addEventListener("mousedown", e => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener("mousemove", draw);

    canvas.addEventListener("mouseup", () => {
        isDrawing = false;
        signatureString = document.getElementById("canv").toDataURL();
        document.getElementById("caixa").value = signatureString;
        console.log("sign ", signatureString);
    });

    canvas.addEventListener("mouseout", () => (isDrawing = false));
})();
