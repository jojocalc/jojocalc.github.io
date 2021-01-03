$(document).ready(function(){
    //语言按钮点击时，切换按钮样式
    $('.lang-head .btn').click(function(e){
        $('.lang-head .btn').removeClass('active');
        $(this).addClass('active');
        //TODO 修改语言值
        lang = $(this).attr('id')
        initView();
    });
    // 活动类型被点击的时候
    $('.event-type').click(function(){
        
        // 隐藏标题界面、显示计算界面
        $('.index-only').hide();
        $('.event-type').hide();
        $('.calc-content').show();

        // 修改计算界面显示标题
        $('#calc-event-type').text($(this).text());

        // 修改活动选择值
        typeIndex = $(this).attr('index');
        type = types[typeIndex]
        events = type['events']
        $("#second-events").empty();
        $.each(events, function(p1, p2) {
            var option = $('<option>'+this[nameKey]+'</option>');
            $("#second-events").append(option)
        }) 
    });

    $('#back-btn').click(function(){
        $('.index-only').show();
        $('.event-type').show();
        $('.calc-content').hide();
    })

})