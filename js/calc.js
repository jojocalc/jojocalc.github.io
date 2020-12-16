// 数据
var jsonData = {};
var types = [];
// 语言
var lang = 'zh'
var nameKey= 'name'
// 选中索引
var typeIndex=0;
var eventIndex=0;
// 参与运算的天数
var restDay = 0;



$(document).ready(function(){
    // TODO语言切换监听，如果语言切换，需要重新执行一遍初始化
    // lang = 'jp'
    // nameKey = 'jpName'
    // 初始化数据
    initData();
    // 初始化动作监听
    initListener()

    // 读取data.js
    function initData(){
        $.ajax({
            url: "data/data.json",
            type: "GET",
            dataType: "json",
            success: function(data) {
                console.log(data)
                jsonData = data;
                // 初始化界面
                initView();
            },
            error: function(data){
                console.log(data)
            }
        })
    }

    //初始化视图
    function initView(){
        types = jsonData['types'];

        // 填充活动类型
        $("#events").empty();
        $.each(types, function(p1, p2) {
            var option = $('<option>'+this[nameKey]+'</option>');
            $("#events").append(option)
        });

        // 填充活动名称
        var type = types[typeIndex]
        var events = type['events']
        $("#second-events").empty();
        $.each(events, function(p1, p2) {
            var option = $('<option>'+this[nameKey]+'</option>');
            $("#second-events").append(option)
        }) 

        var event = events[eventIndex];

        //填充卡片类型
        var cards =  event['cards'];
        $("#card-type").empty();
        $.each(cards, function(p1, p2) {
            var text = this['type']+'-'+this[nameKey];
            var option = $('<option value="'+this['line']+'">'+text+'</option>');
            $("#card-type").append(option)
        }) 
        // 填充活动时间
        $("#start-time").html(event['startDate']+' '+event['startTime'])
        $("#end-time").html(event['endDate']+' '+event['endTime'])
        var endTime = $("#end-time").html();
        var time = getDistanceSpecifiedTime(endTime);
        // 填充剩余时间
        $("#rest-time").html(time);
        // 填充当前活动
        $("#current-event").html($('#events').val() + ' - ' + $("#second-events").val())
        //填充档线
        $("#line").html($("#card-type").val())
    }

    function initListener(){
        $('#lang-zh-btn').click(function(){
            lang='zh'
            nameKey= 'name'
            initView();
        })
        $('#lang-jp-btn').click(function(){
            lang='jp'
            nameKey= 'jpName'
            initView();
        })

        $('#events').change(function() {
            typeIndex=$("#events ").get(0).selectedIndex;
            $("#current-event").html($(this).val() + ' - ' + $("#second-events").val())
            // 填充活动名称
            var type = types[typeIndex]
            var events = type['events']
            $("#second-events").empty();
            $.each(events, function(p1, p2) {
                var option = $('<option>'+this[nameKey]+'</option>');
                $("#second-events").append(option)
            }) 

            var event = events[eventIndex];
            // 填充活动时间
            $("#start-time").html(event['startDate']+' '+event['startTime'])
            $("#end-time").html(event['endDate']+' '+event['endTime'])
            var endTime = $("#end-time").html();
            var time = getDistanceSpecifiedTime(endTime);
            // 填充剩余时间
            $("#rest-time").html(time);
            $("#result-div").hide();
        })

        $('#second-events').change(function() {
            eventIndex=$("#second-events ").get(0).selectedIndex;
            $("#current-event").html($('#events').val() + ' - ' + $(this).val())
            var type = types[typeIndex]
            var events = type['events']
            var event = events[eventIndex]

             // 填充活动时间
             $("#start-time").html(event['startDate']+' '+event['startTime'])
             $("#end-time").html(event['endDate']+' '+event['endTime'])
             var endTime = $("#end-time").html();
             var time = getDistanceSpecifiedTime(endTime);
             // 填充剩余时间
             $("#rest-time").html(time);
            //填充卡牌数据
             //填充卡片类型
            var cards =  event['cards'];
            $("#card-type").empty();
            $.each(cards, function(p1, p2) {
                var text = this['type']+'-'+this[nameKey];
                var option = $('<option value="'+this['line']+'">'+text+'</option>');
                $("#card-type").append(option)
            }) 
            $("#line").html($("#card-type").val())
            $("#result-div").hide();
        })

        //监听卡牌变更
        $('#card-type').change(function() {
            $("#line").html($(this).val())
            $("#result-div").hide();
        })

        // 计算
        $("#calc-btn").click(function(){
            if(new Date($('#start-time').html()) > new Date()) {
                alert("活动未开始");
                return
            }

            if(new Date($('#end-time').html()) < new Date()) {
                alert("活动已结束");
                return
            }
            var currentDb = $("#current-db").val();
            var mission = 0;
            var permission = 3;
            var dp = 5;
            var type = types[typeIndex]
            var events = type['events']
            var event = events[eventIndex]
            //档线
            var line = $("#line").html();
            //差值 = 档线-总代币
            var result = line - currentDb;
            //代币数/关
            var token = $("#token").val();
            //如果小于0 就返回0
            if(result <= 0) {
                $("#result-div").show();
                $("#result-day").html($("#rest-time").html().split("天")[0])
                $("#result-type").html($("#card-type").find("option:selected").text())
                $("#result-count").html(0)
                $("#result-hp").html(0);
                $("#result-dp").html(0);
                return
            }
            //计算每日关卡数
            var missionNum = $('input[name="mission-num"]:checked').val(); 
            if('finish-all' == missionNum) {
                mission = event['mission']
            } else {
                mission = $("#part-mission").val();
            }
            //闯关数按3来算
            mission*=3
            console.log(mission);
            //附加关卡值
            var addNum = $('input[name="add-num"]:checked').val();
            mission = parseInt(mission) + parseInt(addNum);

            //关卡数 = 差值 除以 每关可以获取的代币数
            var resultCount = Math.ceil(result / token) - (mission * restDay);
            console.log("关卡数："+resultCount)
            //每3关的dp数 = 关卡数 除以 3
            resultCount = Math.ceil(resultCount / permission)
            // 最终结果 = 每3关的dp数 * 5
            result = resultCount * dp;

            $("#result-div").show();

            $("#result-day").html(restDay)
            $("#result-type").html($("#card-type").find("option:selected").text())
            $("#result-count").html(resultCount)
            var type = types[typeIndex]
            var hp = type['hp'];
            $("#result-hp").html(resultCount*hp);
            $("#result-dp").html(result);
        
        });
    }

    /**
     * 获取距离指定时间还有多少天
     * @param {String | Number | Date} dateTime 日期时间
     * @example
     * ```javascript
     *     getDistanceSpecifiedTime('2019/02/02 02:02:00');
     *     getDistanceSpecifiedTime(1549036800000);
     *     getDistanceSpecifiedTime(new Date("2019/2/2 00:00:00"));
     * ```
     */
    function getDistanceSpecifiedTime(dateTime) {
        // 指定日期和时间
        var EndTime = new Date(dateTime);
        // 当前系统时间
        var NowTime = new Date();
        var t = EndTime.getTime() - NowTime.getTime();
        var d = Math.floor(t / 1000 / 60 / 60 / 24);
        var h = Math.floor(t / 1000 / 60 / 60 % 24);
        var m = Math.floor(t / 1000 / 60 % 60);
        var s = Math.floor(t / 1000 % 60);
        if(d < 0) {
            return '已结束';
        }
        if(h > 0) {
            restDay = parseInt(d) + 1;
        }
        var html = d + " 天" + h + " 时";
        // var html = d + " 天" + h + " 时" + m + " 分" + s + " 秒";
        return html;
    }

});

