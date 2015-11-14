
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


function selectTool()
{
	current_tool = $("#tool-selector").val();

	for( var k in toolset )
	{
		if( toolset.hasOwnProperty(k) )
		{
			toolset[k].hide();
		}
	}

	toolset[current_tool].show();
}

$("#tools-div").append("<select id='tool-selector'></select>");
$("#tool-selector").bind("change", function() {
	selectTool();
});

function makeToolset()
{
	var tools = {};
	function addTool( tool, name, toolbox_div ) {
		tools[name] = new tool(toolbox_div, name);
		$("#tool-selector").append("<option selected='selected' value='" + name + "'>" + name + "</option>");
		current_tool = name;
	}
	addTool( PointTool, "pointedit", "pointedit_toolbox" );
	addTool( BoxTool, "boxedit", "boxedit_toolbox" );
	return tools;
}

var toolset = makeToolset("toolset");


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

var selectedImage = null;

function makePager( index ) {
	return function() {
		current_frame = index;
		frameChanged();
	}
}

function reloadPagination() {
	var pagi = $("#sheetPagination");
	pagi.empty();
	pagi.append("<ul class='pagination' id='paginer'></ul>");

	var paginer = $("#paginer");

	var prev_enabled = (cols * rows == 1 || current_frame == 0) ? "class='disabled'" : "";
	var prev = paginer.append('<li id="prevpag" ' + prev_enabled + '><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>');
	prev.bind("click", function() {
		dec_frame();
	});

	var elem;
	for( var i = 1; i <= cols * rows; i++ ) {
		if( (current_frame+1) == i ) {
			elem = paginer.append('<li class="active"><a id="pager' + i + '" href="#">' + i + '<span class="sr-only">(current)</span></a></li>');
			$("#pager" + i).bind("click", makePager(i-1));
		} else {
			elem = paginer.append('<li><a id="pager' + i + '" href="#">' + i + '</li>');
			$("#pager" + i).bind("click", makePager(i-1));
		}
	}

	var next_enabled = (cols * rows == 1 || current_frame == rows * cols - 1) ? "class='disabled'" : "";
	var next = paginer.append('<li id="nextpag" ' + next_enabled + '><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>');
	next.bind("click", function() {
		inc_frame();
	});
}

function loadImage(url) {
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
	reader.readAsDataURL(url);
	frameChanged();
}

function handleImage(e){
	selectedImage = e.target.files[0];
}

$("#loadimg").bind("click", function() {
	loadImage(selectedImage);
});

function handleJson(e){
	var reader = new FileReader();
	reader.onload = function(event){
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
	reloadPagination();
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

function removeElementFromTool()
{
	toolset[current_tool].removeSelected();
}


selectTool();

requestAnimFrame(render);

