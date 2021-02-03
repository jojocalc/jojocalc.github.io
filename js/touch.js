 
 
var touchData;
 // 读取touchData.json
 function initData() {
     $.ajax({
         url: "data/touchData.json?_=" + Math.random(),
         type: "GET",
         dataType: "json",
         success: function (data) {
             console.log(data)
             touchData = data['touchData'];
             //调用布局方法
             layout();
         },
         error: function (data) {
             console.log(data)
         }
     })
 }

 //layout
 function layout() {
    $("#touch-name").empty();
     $.each(touchData, function (p1, p2) {
         var option = $('<option index="' + p1 + '">' + this[nameKey] + '</option>');
         $('#touch-name').append(option)
     })
 }

 function initListener() {

    // 活动类型被点击的时候
    $('.other-type').click(function () {

        // 隐藏标题界面、显示计算界面
        $('.index-only').hide();
        $('.event-type').hide();
        $('.other-type').hide();
        $('.touch-content').show();

        // 修改计算界面显示标题
        $('#touch-type').text($(this).text());
    });

    //返回按钮
    $('#other-back-btn').click(function () {
        $('.index-only').show();
        $('.event-type').show();
        $('.other-type').show();
        $('.touch-content').hide();
    })


    //语言按钮点击时，切换按钮样式
    $('.lang-head .btn').click(function (e) {
        $('.lang-head .btn').removeClass('active');
        $(this).addClass('active');
        lang = $(this).attr('id')
        if (lang == 'jp') {
            nameKey = 'jpName'
        } else {
            nameKey = 'name'
        }
        layout()
    });

    //监听被摸的那位变更，修改图片
    $('#touch-name').change(function () {
        var index = $("#touch-name").get(0).selectedIndex;
        var item = touchData[index];
        var imgPath = "";

        if (item['image'] == undefined) {
            $("#touch-img").attr("src", "imgs/default.jpg");
            return;
        }

        if (item['imageDir'] && item['imageDir'] != "") {
            imgPath = "imgs/" + item['imageDir'] + "/" + item['image'];
        } else {
            imgPath = "imgs/" + item['image'];
        }
        if (imgPath.indexOf('.jpg') != -1 || imgPath.indexOf('.png') != -1) {
            $("#touch-img").attr("src", imgPath)
        } else {
            $("#touch-img").attr("src", imgPath + ".jpg")
        }

    })

};

 $(document).ready(function () {

     initData();
     initListener();


 });