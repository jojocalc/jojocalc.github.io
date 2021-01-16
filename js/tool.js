var jsonData;
var resultData;
$(document).ready(function () {


    // 初始化数据
    initData();


    // 读取data.js
    function initData() {
        $.ajax({
            url: "data/data.json",
            type: "GET",
            dataType: "json",
            success: function (data) {
                console.log(data)
                jsonData = data;
                //调用布局方法
                layout();
            },
            error: function (data) {
                console.log(data)
            }
        })
    }

    // <!-- 三个类型 中文名、日文名、每关消耗的体力-->
    // <!-- "name":"Pop quiz",
    // "jpName":"Pop quiz",
    // "hp": 8,
    // "events":[] -->




    function layout() {
        var types = jsonData['types']
        $.each(types, function (p1, p2) {

            //添加标题
            var typeUl = $('<h1 class="event-type">');
            typeUl.text(this['name'])

            // 添加中文名、日文名、活动消耗体力
            var typeDiv = $('<div class="type-div">')

            //中文名
            var nameLabel = $('<label>');
            nameLabel.text('中文名(英文名):')
            var nameInput = $('<input class="type-name">');
            nameInput.val(this['name'])
            typeDiv.append(nameLabel)
            typeDiv.append(nameInput)

            // 日文名
            var jpNameLabel = $('<label>');
            jpNameLabel.text('日文名:')
            var jpNameInput = $('<input class="type-jpName">');
            jpNameInput.val(this['jpName'])
            typeDiv.append(jpNameLabel)
            typeDiv.append(jpNameInput)

            // 体力值
            var hpLabel = $('<label>');
            hpLabel.text('每关消耗的体力值:')
            var hpInput = $('<input class="type-hp">');
            hpInput.val(this['hp'])
            typeDiv.append(hpLabel)
            typeDiv.append(hpInput)

            var addEventButton = $('<button>新增活动</button>')

            $('body').append(typeUl)
            $('body').append(typeDiv)
            $('body').append(addEventButton)
            addLine()
            var typeContainer = $('<div>')

            $('body').append(typeContainer)
            addLine();
            // 活动数组
            var events = this['events'];
            $.each(events, function (p1, p2) {
                // 活动数据
                creatEvent(this, typeContainer)
            })

            //添加活动按钮
            addEventButton.click(function (event) {
                creatEvent(emptyEvent, typeContainer)
                var eventId = "#" + 
                typeContainer.children("#test1");
            });

        });


    }


    function addLine() {
        var lineDiv = $('<div class="line-div"></div>')
        $('body').append(lineDiv);
    }


    // 结构
    var emptyEvent = {
        "name": "",
        "jpName": "",
        "startDate": "",
        "endDate": "",
        "startTime": "",
        "endTime": "",
        "cards": []
    }

    // <!-- 活动数组 -->
    // <!-- "name":"Angelic Demons",
    // "jpName": "天使のような悪魔",
    // "startDate": "2021/1/09",
    // "endDate":"2021/12/20",
    // "startTime": "09:00:00",
    // "endTime": "14:00:00",
    // "mission": 26, 
    // "cards"-->

    function creatEvent(event, container) {

        //add opration div
        var buttonDiv = $('<div>')

        var delButton = $('<button cl-target="' + event['name'] + '" id="del">删除</button>')
        var hideButton = $('<button cl-target="' + event['name'] + '" id="hide">显示</button>')

        buttonDiv.append(delButton)
        buttonDiv.append(hideButton)

        container.append(buttonDiv);

        var eventPevent = $('<div hidden=true id="' + event['name'] + '">')

        //add title
        var eventTitle = $('<h3 id="h3Title">' + event['name'] + '</h3>')

        buttonDiv.append(eventTitle);

        // add event div
        var eventDiv = $('<div class="event-name-div">')

        // ==============名称=============
        //中文名
        var nameLabel = $('<label>');
        nameLabel.text('中文名(英文名):')
        var nameInput = $('<input class="event-name">');
        nameInput.val(event['name'])
        eventDiv.append(nameLabel)
        eventDiv.append(nameInput)

        // 日文名
        var endTimeLabel = $('<label>');
        endTimeLabel.text('日文名:')
        var endTimeInput = $('<input class="event-jpName">');
        endTimeInput.val(event['jpName'])
        eventDiv.append(endTimeLabel)
        eventDiv.append(endTimeInput)

        // ==============开始时间=============
        var startDateDiv = $('<div class="event-startdate-div">')
        //开始日期
        var startDateLabel = $('<label>');
        startDateLabel.text('开始日期:')
        var startDateInput = $('<input class="start-date">');
        startDateInput.val(event['startDate'])
        startDateDiv.append(startDateLabel)
        startDateDiv.append(startDateInput)

        //开始时间
        var startTimeLabel = $('<label>');
        startTimeLabel.text('开始时间:')
        var startTimeInput = $('<input class="start-time">');
        startTimeInput.val(event['startTime'])
        startDateDiv.append(startTimeLabel)
        startDateDiv.append(startTimeInput)

        // ==============结束时间=============
        var endDateDiv = $('<div class="event-enddate-div">')
        //开始日期
        var endDateLabel = $('<label>');
        endDateLabel.text('结束日期:')
        var endDateInput = $('<input class="end-date">');
        endDateInput.val(event['endDate'])
        endDateDiv.append(endDateLabel)
        endDateDiv.append(endDateInput)

        //开始时间
        var endTimeLabel = $('<label>');
        endTimeLabel.text('结束时间:')
        var endTimeInput = $('<input class="end-time">');
        endTimeInput.val(event['endTime'])
        endDateDiv.append(endTimeLabel)
        endDateDiv.append(endTimeInput)

        // ==============关卡数=============
        var missionDiv = $('<div class="mission-div">')
        //关卡数
        var missionLabel = $('<label>');
        missionLabel.text('关卡数:')
        var missionInput = $('<input class="mission">');
        missionInput.val(event['mission'])
        missionDiv.append(missionLabel)
        missionDiv.append(missionInput)

        eventPevent.append(eventDiv)
        eventPevent.append(startDateDiv)
        eventPevent.append(endDateDiv)
        eventPevent.append(missionDiv)

        var cards = event['cards'];
        var table = $("<table border=\"1\">");
        eventPevent.append(table)
        var th = ["类型", "中文(英文名)", "日文名", "图片名", "档线", "操作"]
        var keys = ["type", "name", "jpName", "image", "line", "delete"]
        var trHeader = $("<tr></tr>");
        trHeader.appendTo(table);
        for (var j = 0; j < th.length; j++) {
            var td = $("<td>" + th[j] + "</td>");
            td.appendTo(trHeader);
        }
        $.each(cards, function (p1, p2) {
            // 卡牌数据(用表格来存储)
            var tr = $("<tr></tr>");
            tr.appendTo(table);
            for (var j = 0; j < keys.length; j++) {
                val = this[keys[j]];
                if (j == keys.length - 1) {
                    var delTdBtn = $("<button>删除</button>")
                    var delTd = $("<td></td>");
                    delTd.append(delTdBtn);
                    delTdBtn.click(function () {
                        tr.remove();
                    })
                    delTd.appendTo(tr);
                } else {
                    var td = $("<td>" + val + "</td>");
                    td.appendTo(tr);
                }
            }

        })

        var addCardBtn = $('<button style="margin-top: 10px">新增卡片</button>')
        eventPevent.append(addCardBtn)

        container.append(eventPevent);

        var lineDiv = $('<div class="line-div"></div>')
        container.append(lineDiv);

        hideButton.click(function (event) {
            var hidden = eventPevent.is(':hidden')
            if (hidden) {
                hideButton.text("隐藏")
                $(eventPevent).show()
            } else {
                hideButton.text("显示")
                $(eventPevent).hide()
            }
        });

        delButton.click(function (event) {
            buttonDiv.remove();
            eventPevent.remove();
            lineDiv.remove();
        });

        addCardBtn.click(function () {
            var tr = $("<tr></tr>");
            tr.appendTo(table);
            for (var j = 0; j < keys.length; j++) {
                if (j == keys.length - 1) {
                    var delTdBtn = $("<button>删除</button>")
                    var delTd = $("<td></td>");
                    delTd.append(delTdBtn);
                    delTdBtn.click(function () {
                        tr.remove();
                    })
                    delTd.appendTo(tr);
                } else {
                    var td = $("<td></td>");
                    td.appendTo(tr);
                }
            }
        })

        table.on("dblclick", "td", function () {
            /* 1.先拿到这个td原来的值，然后将这个td添加一个input:text,并且原来的值不动 */
            var td = $(this)
            var tdVal = td.text();

            var oInput = $("<input class='inputStyle' type='text'/>");
            oInput.val(tdVal);
            $(this).html(oInput);
            oInput.focus();
            /* 2.失去焦点，这个td变为原来的text，value为修改过后的value */
            oInput.blur(function () {
                td.text($(this).val())
                $(this).remove();
            });
        });

    }

    // <!-- 卡牌数组 -->
    // <!-- {
    //     "type": "UR(Demon)",
    //     "name":"Not Taking It Off",
    //     "jpName":"脱ぎたくない",
    //     "image": "",
    //     "line": 294000


    // 收缩逻辑

    function download() {
        //TODO 获取数据的逻辑
        var blob = new Blob([JSON.stringify(jsonData)]);
        //对于Blob对象，我们可以创建出一个URL来访问它。使用URL对象的createObjectURL方法。
        var a = document.createElement('a');
        a.download = 'data.json';
        a.href = window.URL.createObjectURL(blob);
        a.click()
    }
});