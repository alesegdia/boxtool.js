
var BoxTool = (function() {

	var box = function(tool_div, tool_name) {
		Tool.call(this, tool_div, tool_name);
	};

	box.prototype = Object.create(Tool.prototype);
	box.prototype.constructor = box;

	box.prototype.createFrameUserData = function() {
		// for temporal rect drawing until mouseUp
		return {
			currentRectTL 	: null,
			currentRectSize : null,
		};
	};

	box.prototype.getNameForElement = function(element, num) {
		return "box" + num;
	};

	box.prototype.mouseDownListener = function(x,y) {
		this.getFrameUserData().currentRectTL = [ x, y ];
		this.getFrameUserData().currentRectSize = [ 0, 0 ];
	};

	box.prototype.mouseUpListener = function(x,y) {
		var min = [
			Math.min(this.getFrameUserData().currentRectTL[0], x),
			Math.min(this.getFrameUserData().currentRectTL[1], y) ];
		var max = [
			Math.max(this.getFrameUserData().currentRectTL[0], x),
			Math.max(this.getFrameUserData().currentRectTL[1], y) ];
		this.getFrameUserData().currentRectSize = [max[0] - min[0], max[1] - min[1]];
		this.insertNewElement({ pos: min, size: this.getFrameUserData().currentRectSize });
		this.getFrameUserData().currentRectTL = null;
		this.getFrameUserData().currentRectSize = null;
	};

	box.prototype.mouseMoveListener = function(x,y) {
		if( this.getFrameUserData().currentRectSize != null )
		{
			this.getFrameUserData().currentRectSize[0] = x - this.getFrameUserData().currentRectTL[0];
			this.getFrameUserData().currentRectSize[1] = y - this.getFrameUserData().currentRectTL[1];
		}
	};

	box.prototype.render = function(x,y) {
		for( var k in this.currentFrameData.elements ) {
			if( this.currentFrameData.elements.hasOwnProperty(k) ) {
				var element = this.getFrameElements()[k];
				var r = element.data;
				var n = element.name;
				ctx.strokeStyle = "rgba(0,0,255,255)";
				ctx.strokeRect(r.pos[0], r.pos[1], r.size[0], r.size[1]);
				ctx.fillStyle= "rgba(0,0,255,255)";
				ctx.fillText(n, r.pos[0], r.pos[1]);
			}
		}

		if( this.getFrameUserData().currentRectTL != null && this.getFrameUserData().currentRectSize != null )
		{
			var pos = this.getFrameUserData().currentRectTL;
			var size = this.getFrameUserData().currentRectSize;
			ctx.strokeStyle = "rgba(255,0,0,255)";
			ctx.strokeRect(pos[0], pos[1], size[0], size[1]);
		}
	};

	return box;

}());

