$(document).ready(function(){

    $("#start-time").html("2020/11/20 00:00:00")
    $("#end-time").html("2020/12/04 14:00:00")
    var endTime = $("#end-time").html();
    var time = getDistanceSpecifiedTime(endTime);
    $("#rest-time").html(time);

    // 根据关卡
    $("#per-mission").on('input',function(){
        console.log(111)
        $("#dp-desc").html("每"+$(this).val()+"关需要多少DP：")
    });

    $('#events').change(function() {
        $("#current-event").html($(this).val())
        // var options=$("#card-type option:selected");
        //TODO 修改活动时间
        if('Pop Quiz' == $(this).val()) {
            $("#start-time").html("2020/11/20 00:00:00")
            $("#end-time").html("2020/12/04 14:00:00")
        } else if ('Birthday Events' == $(this).val()) {
            $("#start-time").html("2020/12/09 00:00:00")
            $("#end-time").html("2020/12/20 14:00:00")
        } else if ('Otaku BootCamp' == $(this).val()) {
            $("#start-time").html("2020/12/21 00:00:00")
            $("#end-time").html("2021/1/20 14:00:00")
        } else if ('Lonely Deil' == $(this).val()) {
            $("#start-time").html("2021/2/09 00:00:00")
            $("#end-time").html("2021/2/20 14:00:00")
        }
        //计算结束时间
        var endTime = $("#end-time").html();
        var time = getDistanceSpecifiedTime(endTime);
        $("#rest-time").html(time);
    })

    $('#card-type').change(function() {
        $("#line").html($(this).val())
    })

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
        if(d <= 0) {
            return '已结束';
        }
        var html = d + " 天" + h + " 时";
        // var html = d + " 天" + h + " 时" + m + " 分" + s + " 秒";
        return html;
    }



    // 计算
    $("#calc-btn").click(function(){
        var currentDb = $("#current-db").val();
        var mission = $("#mission").val();
        var permission = 3;
        var dp = 5;
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
            $("#result-type").html($("#card-type").val())
            $("#result-count").html(0)
            $("#result-dp").html(0);
            return
        }
        //计算每日关卡数
        var missionNum = $('input[name="mission-num"]:checked').val(); 
        if('finish-all' == missionNum) {
            mission = 26
        } else {
            mission = $("#part-mission").val();
        }
        console.log(mission);
        //附加关卡值
        var addNum = $('input[name="add-num"]:checked').val();
        mission+=addNum;

        //关卡数 = 差值 除以 每关可以获取的代币数
        var resultCount = Math.ceil(result / token);
        console.log("关卡数："+resultCount)
        //每3关的dp数 = 关卡数 除以 3
        resultCount = Math.ceil(resultCount / permission)
        // 最终结果 = 每3关的dp数 * 5
        result = resultCount * dp;

        $("#result-div").show();

        $("#result-day").html($("#rest-time").html().split("天")[0])
        $("#result-type").html($("#card-type").val())
        $("#result-count").html(resultCount)
        $("#result-dp").html(result);
     
    });
});