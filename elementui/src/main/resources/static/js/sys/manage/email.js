$(function () {
    var app = new Vue({
        el: "#app",
        data: {
            // 表格当前页数据
            tableData: [],
            // 多选数组
            multipleSelection: [],
            //搜索条件
            criteria: {},

            // 列表页
            searchForm: {
                emailName: '',
                type: ''
            },

            // 新增页
            addFormVisible: false,// 新增界面是否显示
            // 新增界面数据
            emailForm: {
                id: '',
                emailName: '',
                type: '',
                remarks: '',
                status: 0,
                // 以上为表单提交的参数

                emailTypeList: emailTypeList
            },
            emailFormRules: {
                emailName: [
                    {required: true, message: '请填写邮箱', trigger: 'blur'}
                ],
                type: [
                    {type: 'number', required: true, message: '请选择邮件类型', trigger: 'change'}
                ],
                remarks: [
                    {required: true, message: '请填写备注信息', trigger: 'blur'}
                ]
            },

            // 编辑页
            editFormVisible: false,// 编辑界面是否显示

            // 默认每页数据量:pageSize
            pageSize: 10,
            // 当前页码:pageNum
            currentPage: 1,
            // 查询的页码
            start: 1,
            // 默认数据总数
            totalCount: 1000,
        },
        methods: {
            // 从服务器读取数据
            loadData: function (criteria, currentPage, pageSize) {
                criteria['currentPage'] = currentPage;
                criteria['pageSize'] = pageSize;
                // console.log(criteria); // {currentPage:1, pageSize:10, userMsg: "aaa"}
                this.$http.get("get_emails_json", criteria).then(function (res) {
                    this.tableData = res.data.lists;
                    this.totalCount = res.data.count;
                }, function () {
                    console.log('failed');
                });
            },

            // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
            handleSizeChange: function (val) {
                this.pageSize = val;
                this.loadData(this.criteria, this.currentPage, this.pageSize);
            },

            // 页码变更, 如第1页变成第2页时,val=2
            handleCurrentChange: function (val) {
                this.currentPage = val;
                this.loadData(this.criteria, this.currentPage, this.pageSize);
            },

            // 搜索,提交表单
            submitForm: function () {
                var _this = this;
                this.$refs.searchForm.validate(function (result) {
                    if (result) {
                        var searchFormParams = getSearchFormParams(_this);
                        _this.criteria = searchFormParams;
                        _this.loadData(_this.criteria, _this.currentPage, _this.pageSize)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 刷新
            handleRefresh: function () {
                window.location.href = localStorage.getItem("adminPath") + "/manage/email/index";
            },

            // 重置
            handleReset: function () {
                this.$refs.searchForm.resetFields();
            },

            // 修改状态
            handleChangetStatus: function (index, row) {
                var id = row.id;
                var status = row.status == 1 ? 0 : 1;
                this.$confirm('确定修改该条记录的状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    changeStatus(this, id, status);
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

            // 显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.emailForm.id = '';
                this.emailForm.emailName = '';
                this.emailForm.type = '';
                this.emailForm.remarks = '';
                this.emailForm.status = 0;
            },

            // 新增
            addSubmit: function () {
                var _this = this;
                this.$refs.emailForm.validate((valid) => {
                    if (valid) {
                        var addFormParams = getFormParams(_this);
                        // console.log(addFormParams);
                        add(_this, addFormParams)
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
                this.emailForm.id = row.id;
                this.emailForm.emailName = row.emailName;
                this.emailForm.type = row.type;
                this.emailForm.remarks = row.remarks;
                this.emailForm.status = row.status;
            },

            // editSubmit
            editSubmit: function () {
                var _this = this;
                this.$refs.emailForm.validate((valid) => {
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
            },

            // 多选响应
            handleSelectionChange: function (val) {
                // 循环该数组,取出id放到(push)multipleSelection
                var ids = [];
                for (var i = 0; i < val.length; i++) {
                    ids.push(val[i].id);
                }
                this.multipleSelection = ids;
                // console.log(this.multipleSelection);
            },

            // 批量删除
            handleBatchDel: function () {
                var ids = this.multipleSelection;
                if (ids.length > 0) {
                    this.$confirm('确定要删除这批记录?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        batchdel(this, ids);
                    }).catch(() => {
                        this.$message({
                            showClose: true,
                            message: '已取消删除操作'
                        });
                    });
                } else {
                    this.$alert('请至少勾选一条记录', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                }
            }

        }
    });
    //载入数据
    app.loadData(app.criteria, app.currentPage, app.pageSize);

});

function getSearchFormParams(_this) {
    var q = {};
    var formData = _this.searchForm;
    for (var item in formData) {
        q[item] = formData[item];
    }
    return q;
}
function getFormParams(_this) {
    var q = "";
    var formData = _this.emailForm;
    for (var item in formData) {
        if (item == "emailTypeList") {
            continue;
        }
        q += item + "=" + formData[item] + "&";
    }
    q = q.substring(0, q.length - 1);
    return q;
}
function changeStatus(_this, id, status) {
    $.post("changeStatus", {id: id, status: status}, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已成功修改了该条记录的状态',
                type: 'success'
            });
            _this.loadData(_this.criteria, _this.currentPage, _this.pageSize);
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
            _this.loadData(_this.criteria, _this.currentPage, _this.pageSize);
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
            _this.loadData(_this.criteria, _this.currentPage, _this.pageSize);
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
            _this.loadData(_this.criteria, _this.currentPage, _this.pageSize);
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
function batchdel(_this, ids) {
    $.post("batchDel", "ids=" + ids, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已批量删除成功',
                type: 'success'
            });
            _this.loadData(_this.criteria, _this.currentPage, _this.pageSize);
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