// 数据
var jsonData = {};
var types = [];
// 语言
var lang = 'zh'
var nameKey = 'name'
// 选中索引
var typeIndex = 0;
var eventIndex = 0;
var cardIndex = 0;
// 参与运算的天数
var restDay = 0;

var type = {}
var events = {}
var event = {}

//TODO 自定义档线 、 自定义结束时间
var cxCalendarApi;



$(document).ready(function () {

    function getFormatTime(date) {
        console.log(date);
        var y = date.getFullYear();
        console.log(y);
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '/' + m + '/' + d + " 14:00:00";
    }
    //设置日历初始值为 当天的下午14点
    $('#input-end-time').val(getFormatTime(new Date()));

    // 初始化数据
    initData();
    // 初始化动作监听
    initListener()
    // 读取data.js
    function initData() {
        $.ajax({
            url: "data/data.json?_=" + Math.random(),
            type: "GET",
            dataType: "json",
            success: function (data) {
                console.log(data)
                jsonData = data;
                // 初始化界面
                initView();
            },
            error: function (data) {
                console.log(data)
            }
        })
    }

    function changeImage() {
        this.event = events[eventIndex];
        var cards = this.event['cards'];
        var imgPath = "";

        if (cards[cardIndex]['image'] == undefined) {
            $("#card-img").attr("src", "imgs/default.jpg");
            return;
        }

        if (this.event['imageDir'] && this.event['imageDir'] != "") {
            imgPath = "imgs/" + this.event['imageDir'] + "/" + cards[cardIndex]['image'];
        } else {
            imgPath = "imgs/" + cards[cardIndex]['image'];
        }
        if (imgPath.indexOf('.jpg') != -1 || imgPath.indexOf('.png') != -1) {
            $("#card-img").attr("src", imgPath)
        } else {
            $("#card-img").attr("src", imgPath + ".jpg")
        }
    }

    //初始化视图
    function initView() {
        initLang();
        types = jsonData['types'];

        // 填充活动类型
        $("#events").empty();
        $.each(types, function (p1, p2) {
            var option = $('<option>' + this[nameKey] + '</option>');
            $("#events").append(option)
        });

        // 填充活动名称
        type = types[typeIndex]
        events = type['events']
        $("#second-events").empty();
        $.each(events, function (p1, p2) {
            var option = $('<option>' + this[nameKey] + '</option>');
            $("#second-events").append(option)
        })

        this.event = events[eventIndex];

        //填充卡片类型
        var cards = this.event['cards'];
        $("#card-type").empty();
        $.each(cards, function (p1, p2) {
            var text = this['type'] + '-' + this[nameKey];
            var option = $('<option value="' + this['line'] + '">' + text + '</option>');
            $("#card-type").append(option)
        })
        //TODO 判断结束世家是否为空
        var endTime = getEndTime(this.event);

        var time = getDistanceSpecifiedTime(endTime);
        // 填充剩余时间
        $("#rest-time").html(time);
        // 填充当前活动
        $("#current-event").html($('#events').val() + ' - ' + $("#second-events").val())
        //填充档线
        $("#line").val($("#card-type").val())
        // $("#card-img").attr("src",)
        //TODO 图片切换
        changeImage()

    }

    function initListener() {

        // 活动类型被点击的时候
        $('.event-type').click(function () {

            // 隐藏标题界面、显示计算界面
            $('.index-only').hide();
            $('.event-type').hide();
            $('.calc-content').show();

            // 修改计算界面显示标题
            $('#calc-event-type').text($(this).text());

            //特殊处理，如果是Pop才可以修改总加成数
            if ($(this).text() == "Pop Quiz") {
                $("#token").val("");
                $("#token").attr('disabled', false);
            } else if ($(this).text() == "Lonely Devil") {
                $("#token").val("120");
                $("#token").attr('disabled', true);
            } else if ($(this).text() == "Birthday Events") {
                $("#token").val("12");
                $("#token").attr('disabled', true);
            }


            // 修改活动选择值
            typeIndex = $(this).attr('index');
            type = types[typeIndex]
            events = type['events']
            $("#second-events").empty();
            $.each(events, function (p1, p2) {
                var option = $('<option>' + this[nameKey] + '</option>');
                $("#second-events").append(option)
            })
            initView();
        });

        $('#back-btn').click(function () {
            $('.index-only').show();
            $('.event-type').show();
            $('.calc-content').hide();
            $("#result-div").hide();
        })


        //语言按钮点击时，切换按钮样式
        $('.lang-head .btn').click(function (e) {
            $('.lang-head .btn').removeClass('active');
            $(this).addClass('active');
            //TODO 修改语言值
            lang = $(this).attr('id')
            if (lang == 'jp') {
                nameKey = 'jpName'
            } else {
                nameKey = 'name'
            }
            initView();
        });

        $('#events').change(function () {
            typeIndex = $("#events ").get(0).selectedIndex;
            // 填充活动名称
            type = types[typeIndex]
            events = type['events']
            $("#second-events").empty();
            $.each(events, function (p1, p2) {
                var option = $('<option>' + this[nameKey] + '</option>');
                $("#second-events").append(option)
            })
            $("#current-event").html($(this).val() + ' - ' + $("#second-events").val())

            this.event = events[eventIndex];
            $("#line").attr('disabled', true);
            // 填充活动时间
            var endTime = getEndTime(this.event);
            var time = getDistanceSpecifiedTime(endTime);
            // 填充剩余时间
            $("#rest-time").html(time);
            $("#result-div").hide();
        })

        $('#second-events').change(function () {
            eventIndex = $("#second-events ").get(0).selectedIndex;
            $("#current-event").html($('#events').val() + ' - ' + $(this).val())
            this.event = events[eventIndex]
            $("#line").attr('disabled', true);
            // 填充活动时间
            var endTime = getEndTime(this.event);
            var time = getDistanceSpecifiedTime(endTime);
            // 填充剩余时间
            $("#rest-time").html(time);
            //填充卡牌数据
            //填充卡片类型
            var cards = this.event['cards'];
            $("#card-type").empty();
            $.each(cards, function (p1, p2) {
                var text = this['type'] + '-' + this[nameKey];
                var option = $('<option value="' + this['line'] + '">' + text + '</option>');
                $("#card-type").append(option)
            })
            $("#line").val($("#card-type").val())
            $("#result-div").hide();
            cardIndex = 0;
            changeImage()
        })

        //监听卡牌变更
        $('#card-type').change(function () {
            cardIndex = $("#card-type").get(0).selectedIndex;
            //如果文字是Custom则可以输入自定义的档线
            if ($("#card-type").find("option:selected").text().indexOf('Custom') != -1) {
                $("#line").attr('disabled', false);
            } else {
                $("#line").attr('disabled', true);
                $("#line").val($(this).val())
                $("#result-div").hide();
            }
            changeImage();

        })

        /**
         * 时间变更时，剩余时间自动变更
         */
        $('#input-end-time').on('change', function () {
            var time = getDistanceSpecifiedTime($('#input-end-time').val());
            $("#rest-time").html(time);
        })

        // $("#btn-change-line").click(function(){
        //     $("#line").attr('disabled', false);
        // })

        /**
         * 设置自定义关卡的最大值（不超过活动全推的关卡值）
         */
        $("#part-mission").on('change', function () {
            type = types[typeIndex]
            events = type['events']
            this.event = events[eventIndex]
            mission = this.event['mission']
            if ($("#part-mission").val() > mission) {
                $("#part-mission").val(mission)
            }
        })



        // 计算
        $("#calc-btn").click(function () {
            if ($("#input-end-time").is(":hidden")) {
                if (new Date($('#start-time').html()) > new Date()) {
                    alert("活动未开始");
                    return
                }

                if (new Date($('#end-time').html()) < new Date()) {
                    alert("活动已结束");
                    return
                }
            } else {
                if (new Date($('#input-end-time').val()) < new Date()) {
                    alert("活动已结束");
                    return
                }
            }
            var currentDb = $("#current-db").val() == "" ? 0 : $("#current-db").val();
            var mission = 0;
            var permission = 3;
            var dp = 5;
            type = types[typeIndex]
            events = type['events']
            this.event = events[eventIndex]
            //档线
            var line = $("#line").val();
            //差值 = 档线-总代币
            var result = line - currentDb;
            //代币数/关
            var token = $("#token").val() == "" ? 0 : $("#token").val();

            //检查token是否为0
            if (token == 0) {
                alert("请输入正确的加成数")
                return
            }

            //如果小于0 就返回0
            if (result <= 0) {
                showZero();
                return
            }
            //计算每日关卡数
            var missionNum = $('input[name="mission-num"]:checked').val();
            if ('finish-all' == missionNum) {
                mission = this.event['mission']
            } else {
                mission = $("#part-mission").val();
            }
            //闯关数按3来算
            mission *= 3

            //附加关卡值
            var addNum = $('input[name="add-num"]:checked').val();
            mission = parseInt(mission) + parseInt(addNum);

            //关卡数 = 差值 除以 每关可以获取的代币数
            var resultCount = Math.ceil(result / token) - (mission * restDay);
            if (resultCount <= 0) {
                showZero();
                return
            }
            console.log("关卡数：" + resultCount)
            //每3关的dp数 = 关卡数 除以 3
            resultCount = Math.ceil(resultCount / permission)
            // 最终结果 = 每3关的dp数 * 5
            result = resultCount * dp;

            $("#result-div").show();
            $("#result-event").html($("#calc-event-type").html() + " - " + $("#second-events").find("option:selected").text());
            $("#result-day").html(restDay)
            $("#result-type").html($("#card-type").find("option:selected").text())
            $("#result-count").html(resultCount)
            var type = types[typeIndex]
            var hp = type['hp'];
            $("#result-hp").html(resultCount * hp);
            $("#result-dp").html(result);
            if (typeIndex == 1) {
                $("#footer-hint-label").hide();
                $("#footer-lonely-hint").show();
                $("#footer-lonely-result").show();
                var ld = Math.ceil(resultCount / (mission * 5));
                $("#result-extra-count").html(ld);
                $("#result-extra-ld").html(ld);
            } else {
                $("#footer-hint-label").show();
                $("#footer-lonely-hint").hide();
                $("#footer-lonely-result").hide();
            }
        });
    }

    function showZero() {
        $("#result-div").show();
        $("#result-event").html($("#calc-event-type").html() + " - " + $("#second-events").find("option:selected").text());
        $("#result-day").html($("#rest-time").html().split("天")[0])
        $("#result-type").html($("#card-type").find("option:selected").text())
        $("#result-count").html(0)
        $("#result-hp").html(0);
        $("#result-dp").html(0);
        if (typeIndex == 1) {
            $("#footer-hint-label").hide();
            $("#footer-lonely-hint").show();
        } else {
            $("#footer-hint-label").show();
            $("#footer-lonely-hint").hide();
        }
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
        if (d < 0) {
            return lang == 'zh' ? '已结束' : '終わり';
        }
        if (h > 0) {
            restDay = parseInt(d) + 1;
        } else {
            restDay = 0;
        }
        var html = d + " 天" + h + " 时 " + m + " 分";
        // var html = d + " 天" + h + " 时" + m + " 分" + s + " 秒";
        return html;
    }

    function initLang() {
        jQuery.i18n.properties({ //加载资浏览器语言对应的资源文件
            name: 'lang', //资源文件名称
            path: './lang/', //资源文件路径
            language: lang,
            cache: false,
            mode: 'map', //用Map的方式使用资源文件中的值
            callback: function () { //加载成功后设置显示内容
                for (var i in $.i18n.map) { // 
                    $('[data-lang="' + i + '"]').text($.i18n.map[i]);
                }
            }
        });

        $('#input-end-time').cxCalendar({
            type: 'datetime',
            endDate: 2025,
            format: 'Y/m/d H:i:s',
            startDate: 2020,
            language: lang
        }, function (api) {
            cxCalendarApi = api;
            console.log(api);
        });
    }

    function getEndTime(curevent) {
        var endTime;
        if (typeIndex == 1) {
            $("#start-time").hide();
            $("#end-time").hide();
            $("#input-end-date").show();
            $("#input-end-time").show();
            // console.log(cxCalendarApi);
            // cxCalendarApi.show();
            endTime = $("#end-time").html();
        } else {
            $("#start-time").show();
            $("#end-time").show();
            $("#input-end-date").hide();
            $("#input-end-time").hide();
            // 填充活动时间
            $("#start-time").html(curevent['startDate'] + ' ' + curevent['startTime'])
            $("#end-time").html(curevent['endDate'] + ' ' + curevent['endTime'])
            endTime = $("#end-time").html();
        }
        return endTime;
    }

});