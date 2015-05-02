$(function () {
    $('.file').each(function(){
        var text = $(this).attr('data-text');
        if(!text){
            text = 'Upload';
        }
        $(this).wrap('<div class="file_box"><div class="file_btn">'+text+'</div></div>');

        var filename = $(this).attr('data-default');
        if(filename){
            $(this).closest('.file_box').find('.file_btn').before('<div class="preview"><img src="/tmp/'+filename+'"></div>');
            $(this).closest('.file_box').append('<input type="hidden" name="'+$(this).attr('data-name')+'" class="image" value="'+filename+'">');
        }
        $(this).closest('.file_box').on('click','.preview',function(){
            $(this).closest('.file_box').find('.image').remove();
            $(this).remove();
        });

        var up = new jqFileUpload({
            action : $(this).attr('data-href'),
            target : this,
            dataType : 'json',
            loading : function(elm){
                $(elm).closest('.file_box').find('.preview').remove();
                $(elm).closest('.file_box').find('.image').remove();
                $(elm).closest('.file_box').addClass('loading');
            },
            callback : function(elm,result){
                if(result){
                    if(result.status == 0){
                        $(elm).closest('.file_box').find('.file_btn').before('<div class="preview"><img src="'+result['url']+'"></div>');
                        $(elm).closest('.file_box').append('<input type="hidden" name="'+$(elm).attr('data-name')+'" class="image" value="'+result['filename']+'">');
                    }else{
                        alert(result.error_message);
                    }
                }
                $(elm).closest('.file_box').removeClass('loading');
            }
        });
    });
});