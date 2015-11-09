
var Tool = (function() {

	var tool = function(tool_div, tool_name) {
		this.toolDiv = tool_div;
		this.toolName = tool_name;
		this.toolSelectorID = "#" + tool_name + "-selector";
		this.currentFrame = 0;
		this.framesData = [];
		this.currentFrameData = undefined;
	};

	tool.prototype.getToolSelector = function() {
		return $(this.toolSelectorID);
	};

	tool.prototype.clearFrameData = function() {

	};

	tool.prototype.frameChanged = function(new_frame) {
		this.currentFrame = new_frame;
		if( this.framesData[new_frame] == undefined ) {
			this.framesData[new_frame] = this.newFrameData();
		}
	};

	tool.prototype.newFrameData = function() {
		throw new Error("newFrameData not implemented!");
	};

	tool.prototype.createSelect = function() {
		// delete previous selector if any
		this.getToolSelector().remove();

		// create new selector
		this.toolDiv.append("<select id='" + this.toolSelectorID + "'></select>");

		// bind 'onchange' event to this.selectPoint()
		var that = this;
		this.getToolSelector().bind("change", function() {
			that.selectPoint();
		});

		this.regenerateSelector(this.currentFrameData);
	};

	tool.prototype.regenerateSelector( frameData ) {
		throw new Error("regenerateSelector not implemented!");
	};

	return tool;

}());

