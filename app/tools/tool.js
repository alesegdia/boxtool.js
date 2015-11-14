
var Tool = (function() {

	var tool = function(tool_div, tool_name) {
		this.toolDiv = $("#" + tool_div);
		this.toolName = tool_name;
		this.toolSelectorID = tool_name + "-selector";
		this.toolEditorID = tool_name + "-editor";
		this.currentFrame = 0;
		this.framesData = [];
		this.currentFrameData = undefined;
		this.lastUsedNum = 0;
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
		var element_num = this.lastUsedNum;
		this.lastUsedNum = this.lastUsedNum + 1;
		var obj = {
			data : the_data,
			name : this.getNameForElement(the_data, element_num),
			num : element_num
		};
		this.currentFrameData.elements[element_num] = obj;
		this.appendElementOption(obj);
	};

	tool.prototype.appendElementOption = function(element) {
		this.getToolSelector().append("<option " + "value='" + element.num + "'>" + element.name + "</option>");
	};

	tool.prototype.refreshOptions = function() {
		$("#" + this.toolSelectorID + " option").remove();
		for( var k in this.currentFrameData.elements ) {
			if( this.currentFrameData.elements.hasOwnProperty(k) ) {
				var element = this.currentFrameData.elements[k];
				this.appendElementOption(element);
			}
		}
		for( var i = 0; i < this.currentFrameData.elements.length; i++ ) {
		}
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
			elements : {},
		};
		return frameData;
	};

	tool.prototype.createFrameUserData = function() {
		throw new Error("createUserData not implemented");
	};

	tool.prototype.hide = function() {
		this.toolDiv.hide();
		$("#" + this.toolEditorID).hide();
	};

	tool.prototype.show = function() {
		this.toolDiv.show();
		$("#" + this.toolEditorID).show();
	};

	tool.prototype.removeSelected = function() {
		if( this.currentFrameData.selectedElementIndex != null ) {
			var sel = $("#" + this.toolSelectorID).find(":selected").val();
			$("#" + this.toolSelectorID + " option[value='" + sel + "']").remove();

			var elements = this.currentFrameData.elements;
			delete elements[this.currentFrameData.selectedElementIndex];
			this.currentFrameData.selectedElementIndex = null;
			this.refreshOptions();
		}
	};

	tool.prototype.createSelect = function() {
		// delete previous selector if any
		this.getToolSelector().remove();
		this.getToolEditor().remove();

		// create new selector
		this.toolDiv.append("<select class='form-control' multiple id='" + this.toolSelectorID + "'></select>");
		$("#editOptionContent").append("<input type='text' id='" + this.toolEditorID + "' />");

		// bind 'onchange' event to this.selectPoint()
		var that = this;
		this.getToolSelector().bind("change", function() {
			that.currentFrameData.selectedElementIndex = that.getToolSelector().val()[0];
			that.getToolEditor().val(that.currentFrameData.elements[that.currentFrameData.selectedElementIndex].name);
		});
		this.getToolEditor().bind("keyup", function() {
			if( that.currentFrameData.selectedElementIndex != null ) {
				that.currentFrameData.elements[that.currentFrameData.selectedElementIndex].name = that.getToolEditor().val();
				$("#" + that.toolSelectorID + " option[value='" + that.currentFrameData.selectedElementIndex + "']").html( that.getToolEditor().val() );
			}
		});

		var i = 0;
		for( var k in this.currentFrameData.elements ) {
			if( this.currentFrameData.elements.hasOwnProperty(k) ) {
				var element = this.currentFrameData.elements[k];
				var selected = "";
				if( i == 0 ) selected = "selected='selected'";
				var value = element.num;
				var name = element.name;
				this.getToolSelector().append("<option " + selected + " value='" + value + "'>" + name + "</option>");
			}
			i++;
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

	tool.prototype.getDataForFrame = function(num_frame) {
		var elements = [];
		if( this.framesData[num_frame] != undefined ) {
			for( var k in this.framesData[num_frame].elements ) {
				if( this.framesData[num_frame].elements.hasOwnProperty(k) ) {
					elements.push(this.framesData[num_frame].elements[k]);
				}
			}
		}
		return elements;
	};

	return tool;

}());

