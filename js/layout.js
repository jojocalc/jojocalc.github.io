$(document).ready(function(){
    //语言按钮点击时，切换按钮样式
    $('.lang-head .btn').click(function(e){
        $('.lang-head .btn').removeClass('active');
        $(this).addClass('active');
        //TODO 修改语言值
        console.log($(this).attr('id'));
    });
    // 活动类型被点击的时候
    $('.event-type').click(function(){
        $('.index-only').hide();
        $('.event-type').hide();
        $('.calc-content').show();
    });

    $('#back-btn').click(function(){
        $('.index-only').show();
        $('.event-type').show();
        $('.calc-content').hide();
    })

})