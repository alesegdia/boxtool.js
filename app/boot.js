
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        //totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        //totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6

var current_tool;

function makeToolset()
{
	var tools = {
		"pointedit": new PointTool("pointedit_toolbox", "pointedit"),
		"boxedit": new BoxTool("boxedit_toolbox", "boxedit"),
	};
	return tools;
}

var toolset = makeToolset("toolset");



var changeTool = function( )
{
	current_tool = $("#tool-selector").val();
};

changeTool();

requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
     window.webkitRequestAnimationFrame ||
     window.mozRequestAnimationFrame ||
     window.oRequestAnimationFrame ||
     window.msRequestAnimationFrame ||
     function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
       window.setTimeout(callback, 1000/60);
     };
})();

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
var jsonLoader = document.getElementById('jsonLoader');
jsonLoader.addEventListener('change', handleJson, false);

var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');

var img = null;

var cols, rows, current_frame;
cols = rows = 1;
current_frame = 0;

function get_current_row()
{
	return Math.floor(current_frame / cols);
}

function get_current_col()
{
	return current_frame % cols;
}

function dec_frame()
{
	current_frame = current_frame - 1;
	if( current_frame < 0 ) current_frame = 0;
	frameChanged();
}

function inc_frame()
{
	current_frame = current_frame + 1;
	var max_frame = rows * cols - 1;
	if( current_frame > max_frame ) current_frame = max_frame;
	frameChanged();
}


function handleImage(e){
	var reader = new FileReader();
	cols = parseInt($("#cols").val());
	rows = parseInt($("#rows").val());
	function sanitize_number(input) {
		if( typeof(input) != "number" || isNaN(input) || input < 1 ) {
			return 1;
		}
		return input;
	}
	cols = sanitize_number(cols);
	rows = sanitize_number(rows);
	reader.onload = function(event){
		img = new Image();
		img.onload = function(){
			canvas.width = img.width / cols;
			canvas.height = img.height / rows;
		}
		img.src = event.target.result;
	}
	reader.readAsDataURL(e.target.files[0]);
	frameChanged();
}

var bleh;
function handleJson(e){
	var reader = new FileReader();
	reader.onload = function(event){
		toolset["boxedit"].rectdata = eval("(" + window.atob(event.target.result.split(',')[1]) + ")");
		bleh = event.target.result;
	}
	reader.readAsDataURL(e.target.files[0]);
}

var mouseEventListenerFactory = function( listener_string )
{
	return function(event) {
		var canvas = document.getElementById("imageCanvas");
		var x,y;
		var coords = canvas.relMouseCoords(event);
		var canvasX = coords.x;
		var canvasY = coords.y;
		if( isChrome )
		{
			x = event.x;
			y = event.y;
		}
		else if( isFirefox )
		{
			x = event.clientX;
			y = event.clientY;
		}
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;
		//toolset[current_tool][listener_string](x,y);
		toolset[current_tool][listener_string](canvasX, canvasY);
	};
}

function frameChanged()
{
	for( var k in toolset )
	{
		if( toolset.hasOwnProperty(k) ) {
			toolset[k].frameChanged(current_frame);
		}
	}
}

frameChanged();

canvas.addEventListener("mousedown", mouseEventListenerFactory("mouseDownListener"), false);
canvas.addEventListener("mouseup", mouseEventListenerFactory("mouseUpListener"), false);
canvas.addEventListener("mousemove", mouseEventListenerFactory("mouseMoveListener"), false);

var render = function()
{
	// clear canvas
	ctx.fillStyle = "rgb(255,200,200)";
	ctx.strokeWidth = 10;
	ctx.fillRect(0,0,canvas.width, canvas.height);
	ctx.strokeStyle = "rgb(0,0,255)";

	// draw image if it was loaded
	var current_row = get_current_row();
	var current_col = get_current_col();
	if( img != null )
	{
		ctx.drawImage(img,
				img.width 	/ cols * current_col,
				img.height 	/ rows * current_row,
				img.width 	/ cols,
				img.height 	/ rows,
				0, 0,
				img.width 	/ cols,
				img.height 	/ rows
				);
	}

	// draw tools elements
	for( var k in toolset )
	{
		if( toolset.hasOwnProperty(k) ) {
			toolset[k].render(ctx);
		}
	}

	// request next frame
	requestAnimFrame(render);
}

var saveJsonToFile = function()
{
	var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify({ "rects" : boxedit_tool.rectdata, "named_points" : pointedit_tool.named_points }));
	window.open(url, '_blank');
	window.focus();
}



requestAnimFrame(render);

