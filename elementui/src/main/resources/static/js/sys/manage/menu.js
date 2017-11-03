$(function () {
    var app = new Vue({
        el: "#app",
        data: {
            // 表格当前页数据
            tableData: [],

            // 新增页
            addFormVisible: false,// 新增界面是否显示
            // 新增界面数据
            menuForm: {
                id: '',
                parentId: 0,
                parentName: '顶级菜单',
                name: '',
                href: '',
                permission: '',
                icon: '',
                sort: '',
                isShow: 0
            },
            menuFormRules: {
                name: [
                    {required: true, message: '请填写菜单名称', trigger: 'blur'}
                ],
                permission: [
                    {required: true, message: '请填写权限', trigger: 'blur'}
                ],
                icon: [
                    {required: true, message: '请填写菜单图标', trigger: 'blur'}
                ],
                // sort: [
                //     {required: true, message: '请填写排序数', trigger: 'blur'}
                // ] // 注意: 由于 Form 的校验内置了 async-validator，而它会给每个字段加一个默认的值为 string 的 type 规则，即默认情况下字段必须是字符串型
            },

            // 编辑页
            editFormVisible: false// 编辑界面是否显示
        },
        methods: {
            // 从服务器读取数据
            loadData: function () {
                this.$http.get("get_menus_json", {}).then(function (res) {
                    // console.log(res);
                    this.tableData = res.data.menuTreeTable;
                }, function () {
                    console.log('failed');
                });
            },

            // 刷新
            handleRefresh: function () {
                window.location.href = localStorage.getItem("adminPath") + "/manage/menu/index";
            },

            // 修改状态
            handleChangetStatus: function (index, row) {
                var id = row.id;
                var isShow = row.isShow == 1 ? 0 : 1;
                this.$confirm('确定修改该条记录的状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    changeStatus(this, id, isShow);
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: '已取消修改该条记录的状态'
                    });
                });
            },

            // 查看详情
            handleDetail: function (index, row) {
                var id = row.id;
                // todo: 以后再做
            },

            // 保存排序
            // updateSort: function (index, row) {
            //     var id = row.id;
            //     var sort = row.sort;
            //     console.log(index);
            //     console.log(row);
            //     updateSort(this, id, sort);
            // },

            // 选择父级菜单
            selectMenu: function () {
                var _this = this;
                layer.open({
                    type: 2,
                    title: '请选择父级菜单',
                    area: ['300px', '450px'],
                    fixed: true,
                    maxmin: true,
                    content: localStorage.getItem("adminPath") + '/manage/menu/menuTreeSelect',
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {
                        var selectedMenuObj = $(window.frames["layui-layer-iframe" + index].document).find("#selectedMenu");
                        var parentId = selectedMenuObj[0].dataset.id;
                        var parentName = selectedMenuObj[0].dataset.name;
                        if (parentId == undefined) {
                            layer.alert("请选择菜单");
                        } else {
                            _this.menuForm.parentName = parentName;
                            _this.menuForm.parentId = parentId;
                            layer.close(index);
                        }
                    }, btn2: function (index, layero) {
                        layer.close(index);
                    },
                    cancel: function (index) {
                        layer.close(index);
                    }
                });
            },

            // 显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.menuForm.id = '';
                this.menuForm.parentId = '';
                this.menuForm.parentName = "顶级菜单";
                this.menuForm.name = '';
                this.menuForm.href = '';
                this.menuForm.permission = '';
                this.menuForm.icon = '';
                this.menuForm.sort = '';
                this.menuForm.isShow = 0;
            },

            // 新增
            addSubmit: function () {
                var _this = this;
                this.$refs.menuForm.validate((valid) => {
                    if (valid) {
                        var addFormParams = getFormParams(_this);
                        // console.log(addFormParams);
                        add(_this, addFormParams);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 显示编辑页面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                // console.log(row);
                this.menuForm.id = row.id;
                this.menuForm.parentId = row.parentId;
                if (row.parentName == null) {
                    this.menuForm.parentName = "顶级菜单";
                } else {
                    this.menuForm.parentName = row.parentName;
                }
                this.menuForm.name = row.name;
                this.menuForm.href = row.href;
                this.menuForm.permission = row.permission;
                this.menuForm.icon = row.icon;
                this.menuForm.sort = row.sort;
                this.menuForm.isShow = row.isShow;
            },

            // editSubmit
            editSubmit: function () {
                var _this = this;
                this.$refs.menuForm.validate((valid) => {
                    if (valid) {
                        var editFormParams = getFormParams(_this);
                        // console.log(editFormParams);
                        update(_this, editFormParams)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 取消
            cancelAdd: function () {
                this.addFormVisible = false;
                this.$message({
                    showClose: true,
                    message: '已取消新增'
                });
            },
            cancelEdit: function () {
                this.editFormVisible = false;
                this.$message({
                    showClose: true,
                    message: '已取消编辑'
                });
            },

            // 单行删除
            handleDelete: function (index, row) {
                var id = row.id;
                this.$confirm('确定要删除该条记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    del(this, id);
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: '已取消删除操作'
                    });
                });
            }
        }
    });
    //载入数据
    app.loadData();

});

function getFormParams(_this) {
    var q = "";
    var formData = _this.menuForm;
    for (var item in formData) {
        q += item + "=" + formData[item] + "&";
    }
    q = q.substring(0, q.length - 1);
    return q;
}
function changeStatus(_this, id, isShow) {
    $.post("changeStatus", {id: id, isShow: isShow}, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已成功修改了该条记录的状态',
                type: 'success'
            });
            _this.loadData();
        } else {
            _this.$alert(a.msg, '提示', {
                confirmButtonText: '确定',
            });
            return false;
        }
    }).fail(function (jhr) {
        console.log(jhr);
        _this.$alert('修改状态失败', '提示', {
            confirmButtonText: '确定',
        });
    });
}
function updateSort(_this, id, sort) {
    $.post("updateSort", {id: id, sort: sort}, function (a, b) {
        if (a == true) {
            _this.loadData();
        } else {
            _this.$alert(a.msg, '提示', {
                confirmButtonText: '确定',
            });
            return false;
        }
    }).fail(function (jhr) {
        console.log(jhr);
        _this.$alert('更新排序失败', '提示', {
            confirmButtonText: '确定',
        });
    });
}
function add(_this, formParams) {
    $.post("add", formParams, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已成功添加了一条记录',
                type: 'success'
            });
            _this.addFormVisible = false;
            _this.loadData();
        } else {
            // TODO: 如果没有权限要加以判断
            _this.$alert(a.msg, '提示', {
                confirmButtonText: '确定',
            });
            return false;
        }
    }).fail(function (jhr) {
        console.log(jhr);
        _this.$alert('保存失败', '提示', {
            confirmButtonText: '确定',
        });
    });
}
function update(_this, formParams) {
    $.post("update", formParams, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已成功更新了该条记录',
                type: 'success'
            });
            _this.editFormVisible = false;
            _this.loadData();
        } else {
            // TODO: 如果没有权限要加以判断
            _this.$alert(a.msg, '提示', {
                confirmButtonText: '确定',
            });
            return false;
        }
    }).fail(function (jhr) {
        console.log(jhr);
        _this.$alert('保存失败', '提示', {
            confirmButtonText: '确定',
        });
    });
}
function del(_this, id) {
    $.post("del", {id: id}, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已删除成功',
                type: 'success'
            });
            _this.loadData();
        } else {
            _this.$alert(a.msg, '提示', {
                confirmButtonText: '确定',
            });
            return false;
        }
    }).fail(function (jhr) {
        console.log(jhr);
        _this.$alert('删除失败', '提示', {
            confirmButtonText: '确定',
        });
    });
}