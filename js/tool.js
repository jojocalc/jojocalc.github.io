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

            var eventLabel = $('<label>')
            eventLabel.text("活动：")

            $('body').append(typeUl)
            $('body').append(typeDiv)
            // $('body').append(eventLabel)
            addLine();
            // 活动数组
            var events = this['events'];
            $.each(events, function (p1, p2) {
                // 活动数据
                creatEvent(this)
                addLine();
            })

        });


    }


    function addLine() {
        var lineDiv = $('<div class="line-div"></div>')
        $('body').append(lineDiv);
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

    function creatEvent(event) {

        var eventPevent = $('<div id="'+event['name']+'">')



        var eventTitle = $('<h3>' + event['name'] + '</h3>')

        eventPevent.append(eventTitle);

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
        var th = ["类型", "中文(英文名)", "日文名", "图片名", "档线"]
        var keys = ["type", "name", "jpName", "image", "line"]
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
                var td = $("<td>" + val + "</td>");
                td.appendTo(tr);
            }

        })
        $('body').append(eventPevent);
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