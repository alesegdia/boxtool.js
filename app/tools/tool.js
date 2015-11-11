
var Tool = (function() {

	var tool = function(tool_div, tool_name) {
		this.toolDiv = $("#" + tool_div);
		this.toolName = tool_name;
		this.toolSelectorID = tool_name + "-selector";
		this.toolEditorID = tool_name + "-editor";
		this.currentFrame = 0;
		this.framesData = [];
		this.currentFrameData = undefined;
	};

	tool.prototype.getToolSelector = function() {
		return $("#" + this.toolSelectorID);
	};

	tool.prototype.getToolEditor = function() {
		return $("#" + this.toolEditorID);
	};

	tool.prototype.clearFrameData = function() {

	};

	tool.prototype.getFrameUserData = function() {
		return this.currentFrameData.userdata;
	};

	tool.prototype.getFrameElements = function() {
		return this.currentFrameData.elements;
	};

	tool.prototype.insertNewElement = function(the_data) {
		var element_num = this.currentFrameData.elements.length;
		var obj = {
			data : the_data,
			name : this.getNameForElement(the_data, element_num),
			num : element_num
		};
		this.currentFrameData.elements.push(obj);
		this.appendElementOption(obj);
	};

	tool.prototype.appendElementOption = function(element) {
		this.getToolSelector().append("<option " + "value='" + element.num + "'>" + element.name + "</option>");
	};

	tool.prototype.frameChanged = function(new_frame) {
		this.currentFrame = new_frame;
		if( this.framesData[new_frame] == undefined ) {
			this.framesData[new_frame] = this.newFrameData();
		}
		this.currentFrameData = this.framesData[new_frame];
		this.createSelect();
	};

	tool.prototype.newFrameData = function() {
		var userdata = this.createFrameUserData();
		var frameData = {
			userdata : userdata,
			selectedElementIndex : null,
			elements : [],
		};
		return frameData;
	};

	tool.prototype.createFrameUserData = function() {
		throw new Error("createUserData not implemented");
	};

	tool.prototype.createSelect = function() {
		// delete previous selector if any
		this.getToolSelector().remove();
		this.getToolEditor().remove();

		// create new selector
		this.toolDiv.append("<select id='" + this.toolSelectorID + "'></select>");
		this.toolDiv.append("<input type='text' id='" + this.toolEditorID + "' />");

		// bind 'onchange' event to this.selectPoint()
		var that = this;
		this.getToolSelector().bind("change", function() {
			that.currentFrameData.selectedElementIndex = that.getToolSelector().val();
			that.getToolEditor().val(that.currentFrameData.elements[that.currentFrameData.selectedElementIndex].name);
		});
		this.getToolEditor().bind("keyup", function() {
			if( that.currentFrameData.selectedElementIndex != null ) {
				that.currentFrameData.elements[that.currentFrameData.selectedElementIndex].name = that.getToolEditor().val();
				$("#" + that.toolSelectorID + " option[value='" + that.currentFrameData.selectedElementIndex + "']").html( that.getToolEditor().val() );
			}
		});

		for( var i = 0; i < this.currentFrameData.elements.length; i++ )
		{
			var element = this.currentFrameData.elements[i];
			var selected = "";
			if( i == 0 ) selected = "selected='selected'";
			var value = element.num;
			var name = element.name;
			this.getToolSelector().append("<option " + selected + " value='" + value + "'>" + name + "</option>");
		}
	};

	tool.prototype.getNameForElement = function(element, num) {
		throw new Error("getNameForElement not implemented!");
	}

	tool.prototype.mouseDownListener = function(x,y) {
		throw new Error("mouseDownListener not implemented!");
	};

	tool.prototype.mouseUpListener = function(x,y) {
		throw new Error("mouseUpListener not implemented!");
	};

	tool.prototype.mouseMoveListener = function(x,y) {
		throw new Error("mouseMoveListener not implemented!");
	};

	tool.prototype.render = function() {
		throw new Error("render not implemented!");
	};

	return tool;

}());

