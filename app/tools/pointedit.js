
var PointTool = (function() {

	var point = function(tool_div, tool_name) {
		Tool.call(this, tool_div, tool_name);
	};

	point.prototype = Object.create(Tool.prototype);
	point.prototype.constructor = point;

	point.prototype.getNameForElement = function(element, num) {
		return "point" + num + "(" + element.coords[0] + "," + element.coords[1] + ")";
	};

	point.prototype.mouseDownListener = function(x,y) {
		this.insertNewElement({ coords : [x,y] });
	};

	point.prototype.createFrameUserData = function() {
		return {};
	};

	point.prototype.mouseUpListener = function(x,y) {
	};

	point.prototype.mouseMoveListener = function(x,y) {
	};

	point.prototype.render = function(ctx) {
		for( var k in this.currentFrameData.elements ) {
			if( this.currentFrameData.elements.hasOwnProperty(k) ) {
				var element = this.getFrameElements()[k];
				ctx.fillStyle = "rgba(0,127,0,255)";
				var point = element.data.coords;
				var name = element.name;
				ctx.fillRect(point[0]-4, point[1]-4,8,8);
				ctx.fillText(name, point[0]+8, point[1]+4);
			}
		}

		if( this.currentFrameData.selectedElementIndex != null )
		{
			ctx.fillStyle = "rgb(255,0,255)";
			var point = this.getFrameElements()[this.currentFrameData.selectedElementIndex].data.coords;
			var name = this.getFrameElements()[this.currentFrameData.selectedElementIndex].name;
			ctx.fillRect(point[0]-4, point[1]-4,8,8);
			ctx.fillText(name, point[0]+8, point[1]+4);
		}
	};

	return point;

}());


