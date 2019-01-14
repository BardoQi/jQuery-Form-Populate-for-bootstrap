/**
 * @author Bardo Qi
 * @param {jQuery} $ jQuery object
 *
 */

;(function ($) {

    /**
     * 表单渲染选项。
     * KeyType：正常以ID方式查找。这样速度最快。
     * keyPrefix、keySuffix 因为是以ID方式，所以，ID与NAME不能同名，否则，页面ID
     *    会有重复，所以，给表单元素统一添加前缀或后缀，
     * staticClass， 这是BootsTrap3的静态表单（查看表单）中的静态元素，本插件支持
     *    静态元素的渲染
     * groupClass：成组的Checkbox, Radio, ID应当放到 input-group这个div中，这样，
     *    就能通过NAME选中指定的Checkbox 或 Radio
     * customSetValue：自定义赋值的class，默认为 form-setval，当元素有此class,程序
     *    将不再渲染，而是触发 data-setval属性中定义的事件。比如 :
     *    data-setval="eventName",那要通过
     *    $("#yourControl").on('eventName',function(e,data) {
     *
     *    });
     *    这个事件代码，实现你的表单组件的赋值渲染。
     *    注意，当data为数组时，则会通过data对象的list属性传入
     *
     */


    $.defaultPopulateOptions = defaultPopulateOptions = {
        KeyType:			'id',  // 'id' or 'name'
        keyPrefix:			'',
        keySuffix:			'',
        staticClass:        'form-control-static',
        groupClass:         'input-group',
        customSetValue:     'form-setval'   //程序不能正常赋值的 需要添加  form-setval 并增加
    };

    $.fn.populate = function(data, options) {
        // options
        var options = $.extend({
            KeyType:			'id',  // 'id' or 'name'
            keyPrefix:			'',
            keySuffix:			'_edit',
            staticClass:        'form-control-static',
            groupClass:         'input-group',
            customSetValue:     'form-setval'
        }, options);

        var $form = this;
        $.each(data, function (key, value) {
            var element;
            if (options.KeyType=='id'){
                element = $("#" + options.keyPrefix + key + options.keySuffix);
            }
            if (options.KeyType=='name'){
                element = $form.find("[name='" + options.keyPrefix + key + options.keySuffix + "']");
            }

            if (element.elementExists()){
                if (element.is('select')){ //special form types
                    if (value.constructor == Object){
                        var optionHtml='';
                        $(value.data).each(function (key, item) {
                            var selected = '';
                            if(value.selected  == item[value.valueKey]){
                                selected = 'selected=selected';
                            }
                            optionHtml += "<option "+ selected +" value=" + item[value.valueKey] + ">" + item[value.textKey] + "</option>";
                        });
                        element.html(optionHtml);
                    }else{
                        $('option', element).each(function() {
                            if (this.value == value)
                                this.selected = true;
                        });
                    }
                }else if (element.is('textarea')) {
                    element.val(value);
                }else if (element.hasClass(options.groupClass)) {
                    var ctrls = $form.find('[name="' + key + '"]');
                    //console.log(ctrls.first().attr('name'));
                    switch (ctrls.first().attr("type")) {
                        case "radio":
                            populateRadio(ctrls, value);
                            break;
                        case "checkbox":
                            populateCheckBox(ctrls, value);
                            break;
                    }
                }else if (element.hasClass(options.staticClass)){
                    if (element.hasClass(options.customSetValue)){
                        //console.log(element);
                        var event=element.data('setval');
                        if ($.isArray(value)){
                            console.log(event);
                            element.trigger(event,{list:value});
                        }else{
                            element.trigger(event,value);
                        }
                    }else{
                        element.html(value);
                    }
                }else{
                    switch(element.attr("type")){   //input type
                        case "text":
                        case "hidden":
                            if (element.hasClass(options.customSetValue)){
                                var event=element.data('setval');
                                if ($.isArray(value)){
                                    //console.log(event);
                                    element.trigger(event,{list:value});
                                }else{
                                    element.trigger(event,value);
                                }
                            }else{
                                element.val(value);
                            }
                            break;
                        case "radio":
                            populateRadio(element,value);
                            break;
                        case "checkbox":
                            populateCheckBox(element,value);
                            break;
                        default:
                            element.val(value);
                    }  //switch input type
                }
            }
        });
        return this;
    };

    /* Checks if a jQuery object exists in the DOM, by checking the length of its child elements. */
    $.fn.elementExists = function()
    {
        ///     <summary>
        ///     Checks if a jQuery object exists in the DOM, by checking the length of its child elements.
        ///     </summary>
        ///     <returns type="Boolean" />
        return jQuery(this).length > 0;
    };

    function populateRadio(ctrls,value){
        if (ctrls.length >= 1){
            $.each(ctrls,function(index){  // every individual element
                var elemValue = $(this).attr("value");
                //console.log("aaaa--" + elemValue + "--" + value);
                // var elemValueInData = singleVal = value;
                if(elemValue==value){
                    //console.log("aaaa--" + elemValue + "--" + value);
                    $(this).prop('checked', true);
                }else{
                    $(this).prop('checked', false);
                }
            });
        }
    }

    function populateCheckBox(ctrls,value){
        if (ctrls.length > 1){
            $.each(ctrls,function(index){ // every individual element
                var elemValue = $(this).attr("value");
                var elemValueInData = undefined;
                var singleVal;
                for (var i=0; i<value.length; i++){
                    singleVal = value[i];
                    //console.log("singleVal : " + singleVal + " value[i][1]" +  value[i][1] );
                    if (singleVal == elemValue){elemValueInData = singleVal};
                }
                if(elemValueInData){
                    $(this).prop('checked', true);
                }else{
                    $(this).prop('checked', false);
                }
            });
        }else if(ctrls.length == 1){
            ctrl = ctrls;
            if(value) {
                ctrl.prop('checked', true);
            }else {
                ctrl.prop('checked', false);
            }
        }
    }

})(jQuery);

