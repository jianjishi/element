/**
 * Created by winfan on 17/6/14.
 */

var adeviceId = adeviceId;
var contentSourceIdValue="";
console.log(adeviceId);
var q = "";
var option = {
    "bPaginate": true,
    "bLengthChange": true,
    "bServerSide": true,
    "columns": [{
        "title": "序号",
        "data": ""
    }, {
        "title": "ID",
        "data": "id",
        "class": "right hidden"
    }, {
        "title": "软件归档编号",
        "data": "softwareArchiveNo",
        "class": "center"
    }, {
        "title": "软件版本号",
        "data": "softwareVersion",
        "class": "center"
    }, {
        "title": "酷开版本号",
        "data": "coocaaVersion",
        "class": "center"
    }, {
        "title": "内容源id",
        "data": "contentSourceId",
        "class": "center hidden"
    }, {
        "title": "内容源",
        "data": "contentSourceName",
        "class": "center"
    }, {
        "title": "屏幕尺寸",
        "data": "applianceScreenSize",
        "class": "center"
    }, {
        "title": "屏接口",
        "data": "localInfoScreenNo",
        "class": "center"
    }, {
        "title": "代码地址",
        "data": "codeSourcePath",
        "class": "center"
    }, {
        "title": "更新者",
        "data": "updateByName",
        "class": "center"
    }, {
        "title": "更新时间",
        "data": "createDate", //create_date
        "class": "center"
    }
    ],
    "columnDefs": [{
        "targets": 0,
        "data": null,
        "mRender": function (data, type, full, meta) {
            return meta.settings._iDisplayStart + meta.row + 1;
        }
    }, {
        "targets": 2,
        "data": null,
        "mRender": function (data, type, full) {
            var template = $.templates("#operateEditHtml");
            full.href = localStorage.getItem("adminPath") + "/device/closeLoopSoftwareVersionHistory/editPage?adeviceId=" + adeviceId + "&id=" + full.id;
            var htmlOutput = template.render(full);
            return htmlOutput;
        }
    }, {
        "targets": -3,
        "data": null,
        "mRender": function (data, type, full) {
            var template = $.templates("#operateCodeCopyHtml");
            var htmlOutput = template.render(full);
            return htmlOutput;
        }
    }]
};

function loadData(obj, q) {
    option.ajax = localStorage.getItem("adminPath") + "/device/closeLoopSoftwareVersionHistory/get_closeLoopSoftwareVersionHistory_json?adeviceId=" + adeviceId + "&" + q;
    dataTableUtil.build(obj, option);
}


$(function () {


    var q = "";
    loadData($("#example1", q));

    $("#example1").on("click", ".del", function () {
        var id = $(this)[0].dataset.id;
        layer.confirm('确定要删除该条数据？', {btn: ['确定', '关闭']}, function (index) {
            $.post("del", {id: id}, function (a, b) {
                if (a == true) {
                    layer.alert("删除成功");
                    loadData($("#example1"), q);
                } else {
                    layer.alert("删除失败");
                    return false;
                }
            }).fail(function (jhr) {
                console.log(jhr);
                layer.alert("删除失败");
            });
            layer.close(index);
        }, function (index) {
        });
        window.parent.$('.main-header').css('marginTop', '14px')
    });


    $("#addPage").attr("href", localStorage.getItem("adminPath") + "/device/closeLoopSoftwareVersionHistory/addPage?adeviceId=" + adeviceId);
    $("#refresh").attr("href", localStorage.getItem("adminPath") + "/device/closeLoopSoftwareVersionHistory/index?adeviceId=" + adeviceId);

    var pageType = $("body").attr("page-type");
    if (pageType == "add") {

        $("[type='checkbox']").attr("checked", 'true');

        for (var i = 0; i < contentSourceList.length; i++) {

            if (contentSourceList[i].sName == contentName) {
                console.log(contentName);
                contentSourceIdValue = contentSourceList[i].id;
                $("#contentSourceId option[value='" + contentSourceList[i].id + "']").attr("selected", true);
            }
        }
    }

    $("#btn_submit").click(function () {
        initValidateForm();

        var bootstrapValidator = $(".validateForm").data('bootstrapValidator');
        bootstrapValidator.validate();
        //alert(bootstrapValidator.isValid());
        if (bootstrapValidator.isValid()) {
            var q = "";

            q += $('form').serialize();
            if (pageType == "add") {

                $.post("add", q + "&contentSourceId=" + contentSourceIdValue, function (a, b) {
                    if (a == true) {
                        layer.open({
                            title: 'notice',
                            content: '保存成功',
                            end: function () {
                                window.location.href = localStorage.getItem("adminPath") + "/device/closeLoopSoftwareVersionHistory/index?adeviceId=" + adeviceId;
                            }
                        });
                    } else {
                        // TODO: 如果没有权限要加以判断
                        layer.alert(a.msg);
                        return false;
                    }
                }).fail(function (jhr) {
                    console.log(jhr);
                    layer.alert('保存失败');
                });
            } else if (pageType == "edit") {
                var softwareArchiveNo = $("#softwareArchiveNo").val();
                var softwareVersion = $("#softwareVersion").val();
                var coocaaVersion = $("#coocaaVersion").val();
                var te = "&softwareArchiveNo=" + softwareArchiveNo + "&softwareVersion=" + softwareVersion + "&coocaaVersion=" + coocaaVersion;
                q += te;
                debugger;
                console.log(q);
                $.post("update", q, function (a, b) {
                    if (a == true) {
                        layer.open({
                            title: 'notice',
                            content: '更新成功',
                            end: function () {
                                window.location.href = localStorage.getItem("adminPath") + "/device/closeLoopSoftwareVersionHistory/index?adeviceId=" + adeviceId;
                            }
                        });
                    } else {
                        layer.alert(a.msg);
                        return false;
                    }
                }).fail(function (jhr) {
                    console.log(jhr);
                    layer.alert('更新失败');
                });
            }

        } else {
            return;
        }

    });


    $("#validatorform").bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            softwareArchiveNo: {
                group: '.col-lg-4',
                validators: {
                    notEmpty: {
                        message: '软件编号不能为空'
                    }
                }
            }
        }
    });
});