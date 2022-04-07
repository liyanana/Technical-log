$(document).ready(function () {
    var productRow = ['新浪', '头条', '腾讯', '凤凰网', '丁香园'];
    var labelRow = ['确诊', '死亡', '治愈', '疑似'];
    var provinceArr = ['value', 'deathNum', 'cureNum', 'susNum'];
    var provinceValue = decodeURIComponent(comos.getQS('province'));
    var table_data = [
        ['湖北', '6:10-6:20', 'http://wjw.hubei.gov.cn/', ''],
        ['重庆', '7:00前，一天两更', 'http://wsjkw.cq.gov.cn/', ''],
        ['上海', '7:35-7:50，一天两更', 'http://wsjkw.sh.gov.cn/', 'https://weibo.com/u/2372649470'],
        ['海南', '8:00', 'http://wst.hainan.gov.cn/swjw/index.html',
            'http://hndaily.cn/act/feiyan/?from=singlemessage&isappinstalled=0'],
        ['辽宁', '8:00-24:00，一天三更', 'http://wsjk.ln.gov.cn/', ''],
        ['河南', '8:00-9:00', 'http://www.hnwsjsw.gov.cn/', ''],
        ['山东', '8:00-9:00/13:00-14:00', 'http://wsjkw.shandong.gov.cn/', ''],
        ['河北', '8:00左右', 'http://wsjkw.hebei.gov.cn/index.do?templet=index', ''],
        ['广西', '8:00左右，有时凌晨1点更新', 'http://wsjkw.gxzf.gov.cn/xxgks/yqxx/', 'https://weibo.com/gxwsjsw'],
        ['安徽', '8:30-9:00', 'http://wjw.ah.gov.cn/', ''],
        ['天津', '8:30—9:00', 'http://wsjk.tj.gov.cn/', 'https://weibo.com/3244253572/Is91updvX'],
        ['黑龙江', '8:30-9:30', 'http://wsjkw.hlj.gov.cn/', ''],
        ['吉林', '8:40-9:15', 'http://wsjkw.jl.gov.cn/', ''],
        ['江苏', '8:40左右公布', 'http://wjw.jiangsu.gov.cn/', ''],
        ['浙江', '8:45-9:15', 'http://www.zjwjw.gov.cn/', ''],
        ['四川', '8:57-10:30左右', 'http://wsjkw.sc.gov.cn/', ''],
        ['湖南', '9:00-10:00', 'http://wjw.hunan.gov.cn/', ''],
        ['广东', '9:00左右，目前一天两更', 'http://wsjkw.gd.gov.cn/', ''],
        ['江西', '9:00左右，有时凌晨1点到4点', 'http://hc.jiangxi.gov.cn/', ''],
        ['陕西', '10:30左右', 'http://sxwjw.shaanxi.gov.cn/', ''],
        ['福建', '目前是3个时间段：早9点左右、中午13点-14点、晚19点-23点', 'http://wjw.fujian.gov.cn/', ''],
    ];
    var product_url = {
        "凤凰网": "https://news.ifeng.com/c/special/7tPlDSzDgVk",
        "腾讯": "https://news.qq.com//zt2020/page/feiyan.htm",
        "网易": "https://news.163.com/special/epidemic/",
        "丁香园": "https://3g.dxy.cn/newh5/view/pneumonia_peopleapp",
        "头条": "https://i.snssdk.com/feoffline/hot_list/template/hot_list/forum_share.html?forum_id=1656388947394568&is_web_refresh=1",
        "新浪": "https://news.sina.cn/zt_d/yiqing0121",
    };
    var _timer1 = null,
        _timer2 = null;
    if (!provinceValue) {
        return;
    }
    function initAllChinaRow() {
        $('#container').empty();
        $('#container').append(initLoading());
        getOtherData();
    }
    function getOtherData(firstCol) {
        $.ajax({
            type: "get",
            url: "http://172.16.115.99:9202/get_data",
            dataType: "jsonp",
        }).done(function (res) {
            var data = res.data;
            var columns = [{
                name: provinceValue
            }, {
                name: "较昨日+"
            }];
            var columnsObj = {};
            var sina_data = [];
            var newData = [];
            productRow.forEach((product) => {
                data.forEach(item => {
                    if (item.source == product) {
                        newData.push(item);
                    }
                });
            });
            data = newData;
            var sina = data.filter(function (item) {
                return item.source === "新浪"
            })[0]
            sina_data.push(sina.list.filter(function (item) {
                return item.name == provinceValue
            })[0]);
            sina_data.push({
                name: "较昨日+",
                value: sina_data[0].adddaily.conadd,
                susNum: sina_data[0].adddaily.susadd,
                deathNum: sina_data[0].adddaily.deathadd,
                cureNum: sina_data[0].adddaily.cureadd
            });
            // console.log(sina, sina_data);
            for (var i = 0; i < data.length; i++) {
                var tempList = data[i].list.filter(function (item) {
                    return item.name == provinceValue;
                })[0];
                var list = tempList && tempList.city || [];
                for (var j = 0; j < list.length; j++) {
                    var col = list[j].name;
                    if (col == '境外输入人员') {
                        col = '境外输入';
                        list[j].name = '境外输入';
                    }
                    if (!columnsObj[col]) {
                        columnsObj[col] = true;
                        columns.push(list[j]);
                    }
                    // if(i === 0){
                    //     sina_data.push( list[j] );
                    // }
                }
            }
            var sina_city = sina.list.filter(function (item) {
                return item.name == provinceValue
            })[0].city;
            for (var i = 0; i < sina_city.length; i++) {
                sina_data.push(sina_city[i]);
            }
            // console.log(sina_city, sina_data);
            columns.sort((a, b) => {
                return b.value - a.value;
            });
            // console.log(columns, sina_data);
            var $first_col = createFirstCol(columns);
            var $link_col = createLink(columns);
            var $sina_col = createSinaCol(sina_data, columns);
            $('.loading').remove();
            $('#container').append($first_col, $link_col, $sina_col);
            // console.log(data);
            for (var i = 1; i < data.length; i++) {
                // var $col = createOtherRow( data[i], columns, sina_data );
                // $('#container').append($col);
                if (data[i].source !== "新浪") {
                    var $col = createOtherRow(data[i], columns, sina_data);
                    $('#container').append($col);
                } else {
                    // console.log(data[i].source);
                }
            }
            initSetTimeOut();
        }).fail(function (err) {
            $('.loading').text("请求数据失败");
            console.log("请求数据失败，失败原因：" + JSON.parse(err));
        }).always(function () {
            $('.hasCity').on('click', function (e) {
                $(e.target).toggleClass('show');
                // console.log(e.target);
            })
        })
    }
    function createOtherRow(data, columns, fistCol) {
        var $col = $('<div class="other-col"></div>');
        var isNew = false;
        var $rowName = createRow();
        $rowName.append($('<a target="view_window" href="' + product_url[data.source] + '" class="product">' +
            data.source + '</a>'));
        var currentData = data.list.filter(function (item) {
            return item.name == provinceValue
        })[0];
        var $pRow = createRow();
        var $firstCol = $('.first-col .row');
        var $sinaCol = $('.sina-col .row');
        if (currentData) {
            for (var j = 0; j < provinceArr.length; j++) {
                var isNew_curr = false
                var isNew_curr_low=false
                if (currentData[provinceArr[j]] > fistCol[0][provinceArr[j]]) {
                    isNew_curr = true
                }
                if (currentData[provinceArr[j]] < fistCol[0][provinceArr[j]]) {
                    isNew_curr_low = true
                }
                var value = currentData[provinceArr[j]];
                if (value == null) {
                    value = '';
                }
                var $span = $('<span class="' + provinceArr[j] + '">' + value + '</span>');
                if (isNew_curr) {
                    $span.addClass('new');
                    $firstCol.eq(0 + 2).addClass('is-slow');
                    $sinaCol.eq(0 + 2).find('.' + provinceArr[j]).addClass('is-slow')
                    isNew = true;
                }
                 if (isNew_curr_low) {
                    $span.addClass('low');
                    $firstCol.eq(0 + 2).addClass('is-slow');
                    $sinaCol.eq(0 + 2).find('.' + provinceArr[j]).addClass('is-slow')
                    isNew = true;
                }
                $pRow.append($span);
            }
        }
        $col.append($rowName, createLabelRow(), $pRow);
        var firstCity = fistCol;
        // console.log(firstCity, currentData.city);
        // console.log(currentData)
        //各个省份的较昨日+
        // console.log(currentData);
        currentData.city.unshift({
            name: "较昨日+",
            value: currentData.adddaily.conadd,
            susNum: currentData.adddaily.susadd,
            deathNum: currentData.adddaily.deathadd,
            cureNum: currentData.adddaily.cureadd,
        })
        for (var i = 1; i < columns.length; i++) {
            // console.log(firstCity, currentData.city ); 
            var _currentData = currentData.city.filter(function (item) {
                return item.name == columns[i].name
            })[0];
            var $row = createRow();
            if (_currentData) {
                for (var j = 0; j < provinceArr.length; j++) {
                    var isNew_curr = false
                    var isNew_curr_low=false
                    var _diffTarget = firstCity.filter(function (item) {
                        return item.name == columns[i].name
                    })[0];;
                    // console.log(_diffTarget, _currentData, firstCity );
                    if (_diffTarget && Number(_currentData[provinceArr[j]]) > Number(_diffTarget[provinceArr[j]])) {
                        // console.log(_diffTarget, _currentData)
                        isNew_curr = true
                    } else if (!_diffTarget) {
                        isNew_curr = true
                    }


                    if (_diffTarget && Number(_currentData[provinceArr[j]]) < Number(_diffTarget[provinceArr[j]])) {
                        // console.log(_diffTarget, _currentData)
                        isNew_curr_low = true
                    } else if (!_diffTarget) {
                        isNew_curr_low = true
                    }

                    var value = _currentData[provinceArr[j]];
                    // console.log(value, provinceArr[j])
                    if (value == null) {
                        value = '';
                    }
                    $span = $('<span class="' + provinceArr[j] + '">' + value + '</span>')
                    if (isNew_curr) {
                        $span.addClass('new');
                        $firstCol.eq(i + 2).addClass('is-slow');
                        $sinaCol.eq(i + 2).find('.' + provinceArr[j]).addClass('is-slow')
                        // console.log( i, $sinaCol.eq( i + 2 ))
                        isNew = true;
                    }
                     if (isNew_curr_low) {
                        $span.addClass('low');
                        $firstCol.eq(i + 2).addClass('is-slow');
                        $sinaCol.eq(i + 2).find('.' + provinceArr[j]).addClass('is-slow')
                        isNew = true;
                    }
                    $row.append($span);
                }
            } else {
                $row.append($('<span></span>'), $('<span></span>'), $('<span></span>'), $('<span></span>'));
            }
            $col.append($row);
        }
        if (isNew) {
            $rowName.addClass('new');
        }
        // console.log(fistCol);
        return $col;
    }
    function createLink(data) {
        var $col = $('<div class="link-col"></div>');
        $col.append(createRow());
        var $row = createRow();
        $row.text = '地域';
        $col.append($row);
        for (var i = 0; i < data.length; i++) {
            var $row = createRow();
            var name = data[i].name;
            var current = table_data.filter(function (item) {
                return item[0] == name
            })[0];
            // console.log(current);
            if (current) {
                $row.append($('<a target="view_window" href="' + current[2] + '">健委数据</a>'))
            }
            $col.append($row);
        }
        return $col;
    }
    function createFirstCol(data) {
        var $col = $('<div class="first-col"></div>');
        $col.append(createRow(), createRow());
        for (var i = 0; i < data.length; i++) {
            var $row = createRow();
            $row.text(data[i].name);
            $col.append($row);
        }
        return $col;
    }
    function createSinaCol(data, columns) {
        var $col = $('<div class="sina-col"></div>');
        var $row = createRow();
        $row.append($('<a target="view_window" href="' + product_url["新浪"] + '" class="product sina">新浪</a>'));
        $pRow = createRow();
        $col.append($row, createLabelRow());
        for (var i = 0; i < columns.length; i++) {
            var currentData = data.filter(function (item) {
                return item.name === columns[i].name
            })[0];
            // console.log(currentData);
            var $row = createRow();
            if (currentData) {
                for (var j = 0; j < provinceArr.length; j++) {
                    var value = currentData[provinceArr[j]];
                    if (value == null) {
                        value = '';
                    }
                    $row.append($('<span class="' + provinceArr[j] + '">' + value + '</span>'));
                }
            } else {
                $row.append($('<span></span>'), $('<span></span>'), $('<span></span>'), $('<span></span>'));
            }
            $col.append($row);
        }
        return $col;
    }
    function createRow() {
        return $('<div class="row"></div>');
    }
    function createLabelRow() {
        var $row = $("<div class=row></div>");
        for (var i = 0; i < labelRow.length; i++) {
            $row.append('<span> ' + labelRow[i] + ' </span>');
        }
        return $row;
    }
    function initLoading() {
        return $('<div class="loading"> 正在加载数据。。。 </div>');
    }
    function initSetTimeOut() {
        var times = 60;
        var $times = $('.times');
        if (_timer2) {
            clearTimeout(_timer2)
        }
        countDown();
        _timer1 = setTimeout(function () {
            initAllChinaRow();
        }, 1000 * 60);
        function countDown() {
            if (times < 0) {
                return
            };
            $times.text(times);
            times--
            _timer2 = setTimeout(function () {
                countDown();
            }, 1000)
        }
    }
    initAllChinaRow();
    $('.btn-refresh').on('click', function (e) {
        if (_timer1) {
            clearTimeout(_timer1)
        }
        if (_timer2) {
            clearTimeout(_timer2)
        }
        initAllChinaRow();
    });
});