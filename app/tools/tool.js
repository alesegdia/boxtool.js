
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
		var frameData = {
			selectedElementIndex : null,
			elements : [],
		};
	};

	tool.prototype.createSelect = function() {
		// delete previous selector if any
		this.getToolSelector().remove();

		// create new selector
		this.toolDiv.append("<select id='" + this.toolSelectorID + "'></select>");

		// bind 'onchange' event to this.selectPoint()
		var that = this;
		this.getToolSelector().bind("change", function() {
			that.selectElement();
		});

		for( var i = 0; i < this.currentFrameData.elements.length; i++ )
		{
			var element = this.currentFrameData.elements[i];
			var selected = "";
			if( i == 0 ) selected = "selected='selected'";
			var value = this.getValueForElement(element);
			var name = this.getNameForElement(element);
			this.getToolSelector().append("<option " + selected + " value='" + value + "'>" + name + "</option>");
		}
	};

	tool.prototype.getValueForElement = function(element) {
		throw new Error("getValueForElement not implemented!");
	}

	tool.prototype.getNameForElement = function(element) {
		throw new Error("getNameForElement not implemented!");
	}

	tool.prototype.selectElement = function() {
		this.getToolSelector().val(this.currentFrameData.elements[this.currentFrameData.selectedElementIndex].name);
	};

	return tool;

}());

