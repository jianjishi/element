$(function () {
    // var pageType = $("body").attr("page-type");
    var q = "";
    loadData($("#example1"), q);

    $("form").submit(function (e) {
        e.preventDefault();
        q = "" + $('form').serialize();
        loadData($("#example1"), q);
    });

    $("#example1").on("click", ".edit", function () {
        var id = $(this)[0].dataset.id;
        window.location.href = "editPage?id=" + id;
    });

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

    $('#filterColumn input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    });

    $("#filterColumn input:checkbox").on("ifClicked", function (event) {
        var dataTable = $("#example1").dataTable();
        var checked = $(this).prop("checked"); // 选中为true
        var column = this.dataset.column;
        if (checked == true) {
            dataTable.fnSetColumnVis(column, false);
        } else {
            dataTable.fnSetColumnVis(column, true);
        }
    });
});
