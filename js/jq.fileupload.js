/**
 * jqFileUpload
 *
 * @version 1.0.0
 * @author info@ateliee.com
 * @param opts
 */
var jqFileUpload = function(opts){
    var options = $.extend({
        action : '',
        target : '',
        dataType : 'html',
        method : 'POST',
        loading : null,
        callback : null
    },opts);
    this.options = options;
    var _self = this;

    if(!options.target){
        console.log('must be option "target"');
        return;
    }
    this.target = $(options.target);
    var iframe_id = 'jquery_upload_iframe_'+Math.floor(Math.random() * 100000);
    if($('#'+iframe_id).length <= 0){
        $('body').append('<iframe id="'+iframe_id+'" name="'+iframe_id+'">');
        $('#'+iframe_id).hide();
    }
    this.iframe_id = iframe_id;

    // input:file change
    this.checkFileOnChange = function (){
        var value = _self.target.val();
        var element = document.createElement('input');
        element.type = "text";
        element.value = value;
        setInterval(function(){
            var value2 = _self.target.val();
            if((typeof value2 == "string") && (value2) && (element.value != value2)){
                element.value = value2;
                _self.upload();
            }else{
                element.value = value2;
            }
        },300);
    }
    this.upload = function(){
        if(_self.options.loading){
            _self.options.loading(_self.target);
        }
        var form = _self.setFormUpload();
        form.submit();
        _self.resetFormUpload();
    }
    this.tmp_form_data = null;
    this.setFormUpload = function(){
        this.resetFormUpload();

        var form = _self.target.closest('form');
        if(form.length <= 0){
            var id = 'jquery_upload_'+Math.floor(Math.random() * 100000);
            _self.target.wrap('<form id="'+id+'">');
            form = $('#'+id);
        }
        this.tmp_form_data = {
            form : form,
            action : form.attr('action'),
            target : form.attr('taget'),
            method : form.attr('method'),
            enctype : form.attr('enctype'),
            desableds : new Array()
        };
        form.attr('action',_self.options['action']);
        form.attr('enctype','multipart/form-data');
        form.attr('target',_self.iframe_id);
        form.attr('method',_self.options.method);
        $('#'+_self.iframe_id).unbind('load').load(function(){
            _self.onload();
        });
        form.find('input[type=file]').each(function(){
            if(this != _self.target.get(0)){
                if(!$(this).attr('disabled')){
                    $(this).attr('disabled','disabled');
                    _self.tmp_form_data.desableds.push(this);
                }
            }
        });
        return form;
    }
    this.onload = function(){
        if(_self.options.callback){
            var iframe = $('#'+_self.iframe_id).get(0);
            var doc = iframe.contentDocument || iframe.contentWindow.document;
            var result = $('body',doc).html();
            if(_self.options.dataType == 'json'){
                result = eval('('+result+')');
            }
            _self.options.callback(_self.target,result);
        }
    }
    this.resetFormUpload = function(){
        if(_self.tmp_form_data){
            for(var key in _self.tmp_form_data.desableds){
                $(_self.tmp_form_data.desableds[key]).removeAttr('disabled');
            }
            var form = _self.tmp_form_data.form;
            for(var key in _self.tmp_form_data){
                if((key == 'form') || (key == 'desableds')){
                    continue;
                }
                if(_self.tmp_form_data[key]){
                    form.attr(key,_self.tmp_form_data[key]);
                }else{
                    form.removeAttr(key);
                }
            }
            _self.tmp_form_data = null;
        }
    }

    this.checkFileOnChange();
}