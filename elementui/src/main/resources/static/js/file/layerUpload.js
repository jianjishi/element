/**
 * Created by winfan on 17/6/16.
 */

$(function () {

    $("#selectFile").click(function () {
        layer.open({
            type: 2,
            title: '请选择文件上传',
            area: ['300px', '300px'],
            fixed: true,
            maxmin: true,
            content: '/upload/index',
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var selectedOfficeObj = $(window.frames["layui-layer-iframe" + index].document).find("#fileUrl");
                //selectedOfficeObj[0].value
                if (selectedOfficeObj[0].value == undefined || selectedOfficeObj[0].value=="0") {
                    layer.alert("请上传logo");
                } else {
                    $("#logoUrl").val(selectedOfficeObj[0].value);
                    layer.close(index);
                }

            }, btn2: function (index, layero) {
                layer.close(index);
            },
            cancel: function (index) {
                layer.close(index);
            }
        });
    });

});
