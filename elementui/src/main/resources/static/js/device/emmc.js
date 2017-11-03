$(function () {
    var app = new Vue({
        el: "#app",
        data: {
            // 表格当前页数据
            emmcTypeTableData: [],
            emmcSizeTableData: [],
            //搜索条件
            criteria: {},

            // 新增页
            emmcTypeAddFormVisible: false,// 新增界面是否显示
            // 新增界面数据
            emmcTypeForm: {
                id: '',
                label: ''
            },
            emmcSizeAddFormVisible: false,// 新增界面是否显示
            // 新增界面数据
            emmcSizeForm: {
                id: '',
                label: ''
            },

            // 默认每页数据量:pageSize
            emmcTypePageSize: 10,
            emmcSizePageSize: 10,
            // 当前页码:pageNum
            emmcTypeCurrentPage: 1,
            emmcSizeCurrentPage: 1,
            // 查询的页码
            start: 1,
            // 默认数据总数
            emmcTypeTotalCount: 1000,
            emmcSizeTotalCount: 1000,
        },
        methods: {
            // 从服务器读取数据
            emmcTypeLoadData: function (criteria, currentPage, pageSize) {
                criteria['currentPage'] = currentPage;
                criteria['pageSize'] = pageSize;
                // console.log(criteria); // {currentPage:1, pageSize:10, userMsg: "aaa"}
                this.$http.get("get_emmcTypes_json", criteria).then(function (res) {
                    this.emmcTypeTableData = res.data.lists;
                    this.emmcTypeTotalCount = res.data.count;
                }, function () {
                    console.log('failed');
                });
            },
            emmcSizeLoadData: function (criteria, currentPage, pageSize) {
                criteria['currentPage'] = currentPage;
                criteria['pageSize'] = pageSize;
                // console.log(criteria); // {currentPage:1, pageSize:10, userMsg: "aaa"}
                this.$http.get("get_emmcSizes_json", criteria).then(function (res) {
                    this.emmcSizeTableData = res.data.lists;
                    this.emmcSizeTotalCount = res.data.count;
                }, function () {
                    console.log('failed');
                });
            },

            // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
            emmcTypeHandleSizeChange: function (val) {
                this.emmcTypePageSize = val;
                this.emmcTypeLoadData(this.criteria, this.emmcTypeCurrentPage, this.emmcTypePageSize);
            },

            // 页码变更, 如第1页变成第2页时,val=2
            emmcTypeHandleCurrentChange: function (val) {
                this.emmcTypeCurrentPage = val;
                this.emmcTypeLoadData(this.criteria, this.emmcTypeCurrentPage, this.emmcTypePageSize);
            },

            // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
            emmcSizeHandleSizeChange: function (val) {
                this.emmcSizePageSize = val;
                this.emmcSizeLoadData(this.criteria, this.emmcSizeCurrentPage, this.emmcSizePageSize);
            },

            // 页码变更, 如第1页变成第2页时,val=2
            emmcSizeHandleCurrentChange: function (val) {
                this.emmcSizeCurrentPage = val;
                this.emmcSizeLoadData(this.criteria, this.emmcSizeCurrentPage, this.emmcSizePageSize);
            },

            toUpperCase: function (item) {
                this.emmcSizeForm.label = this.emmcSizeForm.label.toUpperCase();
            },

            // 显示新增界面
            emmcTypeHandleAdd: function (index, row) {
                this.emmcTypeAddFormVisible = true;
                this.emmcTypeForm.id = '';
                this.emmcTypeForm.label = ''
            },

            // 新增
            emmcTypeAddSubmit: function () {
                var _this = this;
                this.$refs.emmcTypeForm.validate((valid) => {
                    if (valid) {
                        var addFormParams = getEmmcTypeFormParams(_this);
                        // console.log(addFormParams);
                        emmcTypeAdd(_this, addFormParams)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            emmcSizeHandleAdd: function (index, row) {
                this.emmcSizeAddFormVisible = true;
                this.emmcSizeForm.id = '';
                this.emmcSizeForm.label = ''
            },

            emmcSizeAddSubmit: function () {
                var _this = this;
                this.$refs.emmcSizeForm.validate((valid) => {
                    if (valid) {
                        var addFormParams = getEmmcSizeFormParams(_this);
                        // console.log(addFormParams);
                        emmcSizeAdd(_this, addFormParams)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 取消
            emmcTypeCancelAdd: function () {
                this.emmcTypeAddFormVisible = false;
                this.$message({
                    showClose: true,
                    message: '已取消新增'
                });
            },
            emmcSizeCancelAdd: function () {
                this.emmcSizeAddFormVisible = false;
                this.$message({
                    showClose: true,
                    message: '已取消新增'
                });
            },

            // 单行删除
            emmcTypeHandleDelete: function (index, row) {
                var id = row.id;
                this.$confirm('确定要删除该条记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    emmcTypeDel(this, id);
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: '已取消删除操作'
                    });
                });
            },

            emmcSizeHandleDelete: function (index, row) {
                var id = row.id;
                this.$confirm('确定要删除该条记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    emmcSizeDel(this, id);
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
    app.emmcTypeLoadData(app.criteria, app.emmcTypeCurrentPage, app.emmcTypePageSize);
    app.emmcSizeLoadData(app.criteria, app.emmcSizeCurrentPage, app.emmcSizePageSize);

});

function getEmmcTypeFormParams(_this) {
    var q = "";
    var formData = _this.emmcTypeForm;
    for (var item in formData) {
        q += item + "=" + formData[item] + "&";
    }
    q = q.substring(0, q.length - 1);
    return q;
}
function emmcTypeAdd(_this, formParams) {
    $.post("addEmmcType", formParams, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已成功添加了一条记录',
                type: 'success'
            });
            _this.emmcTypeAddFormVisible = false;
            _this.emmcTypeLoadData(_this.criteria, _this.emmcTypeCurrentPage, _this.emmcTypePageSize);
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
function emmcTypeDel(_this, id) {
    $.post("delEmmcType", {id: id}, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已删除成功',
                type: 'success'
            });
            _this.emmcTypeLoadData(_this.criteria, _this.emmcTypeCurrentPage, _this.emmcTypePageSize);
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

function getEmmcSizeFormParams(_this) {
    var q = "";
    var formData = _this.emmcSizeForm;
    for (var item in formData) {
        q += item + "=" + formData[item] + "&";
    }
    q = q.substring(0, q.length - 1);
    return q;
}
function emmcSizeAdd(_this, formParams) {
    $.post("addEmmcSize", formParams, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已成功添加了一条记录',
                type: 'success'
            });
            _this.emmcSizeAddFormVisible = false;
            _this.emmcSizeLoadData(_this.criteria, _this.emmcSizeCurrentPage, _this.emmcSizePageSize);
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
function emmcSizeDel(_this, id) {
    $.post("delEmmcSize", {id: id}, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已删除成功',
                type: 'success'
            });
            _this.emmcSizeLoadData(_this.criteria, _this.emmcSizeCurrentPage, _this.emmcSizePageSize);
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