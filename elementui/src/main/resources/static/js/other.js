/**
 * Created with IntelliJ IDEA.
 *
 */
function getLocalTime(nS) {
    return nS;
    if (nS == null || nS == "") {
        return "";
    }
    var xxd = new Date(parseInt(nS));
    var fullTime = xxd.getFullYear() + "-" +
        (xxd.getMonth() > 8 ? (xxd.getMonth() + 1) : ("0" + (xxd.getMonth() + 1))) + "-" +
        (xxd.getDate() > 9 ? xxd.getDate() : ("0" + xxd.getDate())) + " " +
        (xxd.getHours() > 9 ? xxd.getHours() : ("0" + xxd.getHours())) + ":" +
        (xxd.getMinutes() > 9 ? xxd.getMinutes() : ("0" + xxd.getMinutes())) + ":" +
        (xxd.getSeconds() > 9 ? xxd.getSeconds() : ("0" + xxd.getSeconds()));
    return fullTime;
}

/**
 *
 * 格式化日期时间
 *
 * @param format
 * @returns
 */
Date.prototype.format = function (format) {
    if (isNaN(this.getMonth())) {
        return '';
    }
    if (!format) {
        format = "yyyy-MM-dd hh:mm:ss";
    }
    var o = {
        /* month */
        "M+": this.getMonth() + 1,
        /* day */
        "d+": this.getDate() - 1,
        /* hour */
        "h+": this.getHours() + 10,
        /* minute */
        "m+": this.getMinutes(),
        /* second */
        "s+": this.getSeconds(),
        /* quarter */
        "q+": Math.floor((this.getMonth() + 3) / 3),
        /* millisecond */
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};


/**
 * 格式化JSON
 * @type {{format: format}}
 */
var JsonUtil = {
    format: function (txt, compress/* 是否为压缩模式 */) {/* 格式化JSON源码(对象转换为JSON文本) */
        var indentChar = '    ';
        if (/^\s*$/.test(txt)) {
            //alert('数据为空,无法格式化! ');
            return;
        }
        var data = txt;

        var draw = [], last = false, This = this, line = compress ? '' : '\n', nodeCount = 0, maxDepth = 0;

        var notify = function (name, value, isLast, indent/* 缩进 */, formObj) {
            nodeCount++;
            /* 节点计数 */
            for (var i = 0, tab = ''; i < indent; i++)
                tab += indentChar;
            /* 缩进HTML */
            tab = compress ? '' : tab;
            /* 压缩模式忽略缩进 */
            maxDepth = ++indent;
            /* 缩进递增并记录 */
            if (value && value.constructor == Array) {/* 处理数组 */
                draw.push(tab + (formObj ? ('"' + name + '":') : '') + '[' //+ line
                );
                /* 缩进'[' 然后换行 */
                for (var i = 0; i < value.length; i++)
                    notify(i, value[i], i == value.length - 1, indent, false);
                draw.push(tab + ']' + (isLast ? "" : ","));//; (isLast ? line : (',' )));/* 缩进']'换行,若非尾元素则添加逗号 */
            } else if (value && typeof value == 'object') {/* 处理对象 */
                draw.push((formObj ? (tab + '"' + name + '":') : '') + '{'
                    + line);
                /* 缩进'{' 然后换行 */
                var len = 0, i = 0;
                for (var key in value)
                    len++;
                for (var key in value)
                    notify(key, value[key], ++i == len, indent, true);
                draw.push(tab + '}' + (isLast ? "" : ",")); //(isLast ? line : (',' + line)));/* 缩进'}'换行,若非尾元素则添加逗号 */
            } else {
                if (typeof value == 'string')
                    value = '"' + value + '"';
                draw.push(tab + (formObj ? ( line + tab + '"' + name + '":') : '') + value
                    + (isLast ? '' : ',') + line);
            }
            ;
        };
        var isLast = true, indent = 0;
        notify('', data, isLast, indent, false);
        return draw.join('');
    }
};

/**
 * 获取元素位置
 * @param e  dom
 * @returns {{left: number, top: number}}
 */
function getElementPosition(e) {
    var x = 0, y = 0;
    while (e != null) {
        x += e.offsetLeft;
        y += e.offsetTop;
        e = e.offsetParent;
    }
    return {left: x, top: y};
}

/**
 * 创建select下拉框
 * @param obj  下拉框对象
 * @param url  数据地址
 * @param arr_params  参数
 * @param valueField  下拉框value
 * @param textField  下拉框text
 * @param setValue  下拉框选中项
 * @param root  第一项
 */
function buildSelect(obj, url, arr_params, valueField, textField, setValue, nullOrZeroToEmpty, rootItem) {
    $.post(url, arr_params, function (res) {
        if (rootItem) {
            var item = '<option value="' + rootItem.value + '">' + rootItem.text + '</option>'
            obj.append(item);
        }
        $(res).each(function () {
            var value = this[valueField];
            if (nullOrZeroToEmpty) {
                if (value == "0" || value == "null" || value == null) {
                    value = "";
                }
            }
            var text = this[textField];
            var item = '<option value="' + value + '">' + text + '</option>'
            obj.append(item);
        });
        obj.val(setValue);
    });

}

var buildWindUtil = {
    buildWind: function (option) {
        $.showWindow({
            title: option.title,
            useiframe: true,
            content: 'url:' + option.url,
            data: option.data,
            buttons: [{
                text: '保存',
                iconCls: 'icon-ok',
                handler: 'doOK'
            }, {
                text: '取消',
                iconCls: 'icon-cancel',
                handler: function (win) {
                    win.close();
                }
            }]
        });
    }
};

var xobj = null;
var xurl = null;
var buildSelectUtil = {
    buildSelect: function (option) {
        option.obj.empty();
        if (option.url == null) {
            if (option.rootItem) {
                var item = '<option value="' + option.rootItem.value + '">' + option.rootItem.text + '</option>'
                option.obj.append(item);
            }
            return false;
        }
        $.post(option.url, option.params, function (res) {
            if (option.rootItem) {
                var item = '<option value="' + option.rootItem.value + '">' + option.rootItem.text + '</option>'
                option.obj.append(item);
            }
            $(res).each(function () {
                var xthis = this;
                var value = xthis[option.valueField];
                if (true) {
                    if (value == "0" || value == "null" || value == null) {
                        value = "";
                    }
                }
                var text = xthis[option.textField];
                var strData = '';
                if (option.data) {
                    $(option.data).each(function () {
                        var value = xthis[this.name];
                        strData += ' data-' + this.name + '="' + value + '"';
                    });
                }
                var item = '<option value="' + value + '" ' + strData + '>' + text + '</option>'
                option.obj.append(item);
            });
            option.obj.val(option.setValue);
        });
    }
};


var ComposeModal = {
    buildModal: function (option) {
        var obj = option.obj;
        obj.empty();
        var icon = option.icon == undefined ? "" : option.icon;
        var title = option.title == undefined ? "" : option.title;
        var url = option.url;
        var width = option.width == undefined ? 600 : option.width;
        var height = $(window).height() - 50;
        obj.append('<div class="modal-dialog" style="width:' + width + 'px; height:' + height + 'px">'
            + '<div class="modal-content" style="width:' + width + 'px; height:' + height + 'px;">'
            + '<div class="modal-header">'
            + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
            + '<h4 class="modal-title"><i class="fa ' + icon + '"></i> ' + title + '</h4>'
            + '</div><div class="modal-body" style="width:' + width + 'px; height:' + (height - 60) + 'px;overflow-y: auto;">'
            + '<iframe src="' + url + '" style="width: 100%; height: 100%;border: none;"></iframe>'
            + '</div></div><!-- /.modal-content -->'
            + '</div><!-- /.modal-dialog -->')
    }
};