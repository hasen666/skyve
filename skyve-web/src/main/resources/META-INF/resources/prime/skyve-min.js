SKYVE=function(){return{getById:function(a){return $(PrimeFaces.escapeClientId(a))},contentOverlayOnShow:function(b,a){SKYVE.getById(b+"_iframe").attr("src",a)},contentOverlayOnHide:function(a){SKYVE.getById(a+"_iframe").attr("src","")},afterContentUpload:function(b,e,d,c){top.$('[id$="_'+b+'"]').val(e);var a="content?_n="+e+"&_doc="+d+"&_b="+b.replace(/\_/g,".")+"&_ctim="+new Date().getTime();top.$('[id$="_'+b+'_link"]').attr("href",a).text(c);top.$('[id$="_'+b+'_image"]').attr("src",a);top.PF(b+"Overlay").hide()},clearContentImage:function(a){$('[id$="_'+a+'"]').val("");$('[id$="_'+a+'_image"]').attr("src","images/blank.gif")},clearContentLink:function(a){$('[id$="_'+a+'"]').val("");$('[id$="_'+a+'_link"]').attr("href","javascript:void(0)").text("<Empty>")},getTextElement:function(a){return SKYVE.getById(a)},getTextValue:function(a){return SKYVE.getTextElement(a).val()},setTextValue:function(b,a){SKYVE.getTextElement(b).val(a)},getPasswordElement:function(a){return SKYVE.getById(a+"password")},getPasswordValue:function(a){return SKYVE.getPasswordElement(a).val()},setPasswordValue:function(b,a){SKYVE.getPasswordElement(b).val(a)},getComboElement:function(a){return SKYVE.getById(a)},getLookupElement:function(a){return SKYVE.getById(a)},getLookupValue:function(a){return SKYVE.getById(a+"_hinput").val()},setLookupValue:function(b,a){SKYVE.getById(b+"_hinput").val(a)},getLookupDescription:function(a){return SKYVE.getById(a+"_input").val()},setLookupDescription:function(b,a){SKYVE.getById(b+"_input").val(a)},getCheckboxElement:function(a){return SKYVE.getById(a)},getCheckboxValue:function(b){var a=SKYVE.getById(b+"_input").val();if(a=="0"){return null}else{if(a=="1"){return true}else{if(a=="2"){return false}else{return SKYVE.getById(b+"_input").is(":checked")}}}},setCheckboxValue:function(e,a){SKYVE.getById(e+"_input").prop("checked",a);var d=SKYVE.getById(e);var c=d.find(".ui-chkbox-box");var b=c.find(".ui-chkbox-icon");if(a){c.addClass("ui-state-active");b.addClass("ui-icon ui-icon-check")}else{c.removeClass("ui-state-active");b.removeClass("ui-icon ui-icon-check")}},toggleFilters:function(a){var d="hiddenFilter";var c=$('[id$="'+a+'"]');if(c!=null){var b=function(){var e=$(this);if(e.hasClass(d)){e.removeClass(d)}else{e.addClass(d)}};c.find(".ui-filter-column").each(b);c.find(".ui-column-customfilter").each(b)}}}}();