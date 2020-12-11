$(document).ready(function(){

    $("#per-mission").on('input',function(){
        console.log(111)
        $("#dp-desc").html("每"+$(this).val()+"关需要多少DP：")
    });

    $("#calc-btn").click(function(){
        var max = $("#max").val();
        var mission = $("#mission").val();
        var permission = $("#per-mission").val();
        var token = $("#token").val();
        var dp = $("#dp").val();
        var line = $("#line").val();
        //差值 = 档线-总代币
        var result = line - max;
        //如果小于0 就返回0
        if(result <= 0) {
            $("#result").val(0);
            return
        }
        //关卡数 = 差值 除以 每关可以获取的代币数
        result = Math.ceil(result / token);
        console.log("关卡数："+result)
        //每3关的dp数 = 关卡数 除以 3
        result = Math.ceil(result / permission)
        // 最终结果 = 每3关的dp数 * 5
        result = result * dp;
        $("#result").val(result);
     
    });
});