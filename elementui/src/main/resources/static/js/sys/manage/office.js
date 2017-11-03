$(function () {
    var app = new Vue({
        el: "#app",
        data: {
            // 表格当前页数据
            tableData: [],

            // 新增页
            addFormVisible: false,// 新增界面是否显示
            // 新增界面数据
            officeForm: {
                id: '',
                parentId: 0,
                parentName: '顶级机构',
                name: '',
                master: '',
                email: '',
                sort: '',
                useable: 0
            },
            officeFormRules: {
                name: [
                    {required: true, message: '请填写机构名称', trigger: 'blur'}
                ],
                master: [
                    {required: true, message: '请填写负责人', trigger: 'blur'}
                ],
                email: [
                    {required: true, message: '请填写邮箱', trigger: 'blur'}
                ],
                // sort: [
                //     {required: true, message: '请填写排序数', trigger: 'blur'}
                // ] todo: 为啥不生效
            },

            // 编辑页
            editFormVisible: false// 编辑界面是否显示
        },
        methods: {
            // 从服务器读取数据
            loadData: function () {
                this.$http.get("get_offices_json", {}).then(function (res) {
                    // console.log(res);
                    this.tableData = res.data.officeTreeTable;
                }, function () {
                    console.log('failed');
                });
            },

            // 刷新
            handleRefresh: function () {
                window.location.href = localStorage.getItem("adminPath") + "/manage/office/index";
            },

            // 修改状态
            handleChangetStatus: function (index, row) {
                var id = row.id;
                var useable = row.useable == 1 ? 0 : 1;
                this.$confirm('确定修改该条记录的状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    changeStatus(this, id, useable);
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

            // 选择父级机构
            selectOffice: function () {
                var _this = this;
                layer.open({
                    type: 2,
                    title: '请选择父级机构',
                    area: ['300px', '450px'],
                    fixed: true,
                    maxmin: true,
                    content: localStorage.getItem("adminPath") + '/manage/office/officeTreeSelect',
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {
                        var selectedOfficeObj = $(window.frames["layui-layer-iframe" + index].document).find("#selectedOffice");
                        var parentId = selectedOfficeObj[0].dataset.id;
                        var parentName = selectedOfficeObj[0].dataset.name;
                        if (parentId == undefined) {
                            layer.alert("请选择机构");
                        } else {
                            _this.officeForm.parentName = parentName;
                            _this.officeForm.parentId = parentId;
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
                this.officeForm.id = '';
                this.officeForm.parentId = '';
                this.officeForm.parentName = "顶级机构";
                this.officeForm.name = '';
                this.officeForm.master = '';
                this.officeForm.email = '';
                this.officeForm.sort = '';
                this.officeForm.useable = 0;
            },

            // 新增
            addSubmit: function () {
                var _this = this;
                this.$refs.officeForm.validate((valid) => {
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
                this.officeForm.id = row.id;
                this.officeForm.parentId = row.parentId;
                if (row.parentName == null) {
                    this.officeForm.parentName = "顶级机构";
                } else {
                    this.officeForm.parentName = row.parentName;
                }
                this.officeForm.name = row.name;
                this.officeForm.master = row.master;
                this.officeForm.email = row.email;
                this.officeForm.sort = row.sort;
                this.officeForm.useable = row.useable;
            },

            // editSubmit
            editSubmit: function () {
                var _this = this;
                this.$refs.officeForm.validate((valid) => {
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
    var formData = _this.officeForm;
    for (var item in formData) {
        q += item + "=" + formData[item] + "&";
    }
    q = q.substring(0, q.length - 1);
    return q;
}
function changeStatus(_this, id, useable) {
    $.post("changeStatus", {id: id, useable: useable}, function (a, b) {
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