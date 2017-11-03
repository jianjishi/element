$(function () {
    var app = new Vue({
        el: "#app",
        data: {
            // 表格当前页数据
            ramTypeTableData: [],
            ramSizeTableData: [],
            //搜索条件
            criteria: {},

            // 新增页
            ramTypeAddFormVisible: false,// 新增界面是否显示
            // 新增界面数据
            ramTypeForm: {
                id: '',
                label: ''
            },
            ramSizeAddFormVisible: false,// 新增界面是否显示
            // 新增界面数据
            ramSizeForm: {
                id: '',
                label: ''
            },

            // 默认每页数据量:pageSize
            ramTypePageSize: 10,
            ramSizePageSize: 10,
            // 当前页码:pageNum
            ramTypeCurrentPage: 1,
            ramSizeCurrentPage: 1,
            // 查询的页码
            start: 1,
            // 默认数据总数
            ramTypeTotalCount: 1000,
            ramSizeTotalCount: 1000,
        },
        methods: {
            // 从服务器读取数据
            ramTypeLoadData: function (criteria, currentPage, pageSize) {
                criteria['currentPage'] = currentPage;
                criteria['pageSize'] = pageSize;
                // console.log(criteria); // {currentPage:1, pageSize:10, userMsg: "aaa"}
                this.$http.get("get_ramTypes_json", criteria).then(function (res) {
                    this.ramTypeTableData = res.data.lists;
                    this.ramTypeTotalCount = res.data.count;
                }, function () {
                    console.log('failed');
                });
            },
            ramSizeLoadData: function (criteria, currentPage, pageSize) {
                criteria['currentPage'] = currentPage;
                criteria['pageSize'] = pageSize;
                // console.log(criteria); // {currentPage:1, pageSize:10, userMsg: "aaa"}
                this.$http.get("get_ramSizes_json", criteria).then(function (res) {
                    this.ramSizeTableData = res.data.lists;
                    this.ramSizeTotalCount = res.data.count;
                }, function () {
                    console.log('failed');
                });
            },

            // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
            ramTypeHandleSizeChange: function (val) {
                this.ramTypePageSize = val;
                this.ramTypeLoadData(this.criteria, this.ramTypeCurrentPage, this.ramTypePageSize);
            },

            // 页码变更, 如第1页变成第2页时,val=2
            ramTypeHandleCurrentChange: function (val) {
                this.ramTypeCurrentPage = val;
                this.ramTypeLoadData(this.criteria, this.ramTypeCurrentPage, this.ramTypePageSize);
            },

            // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
            ramSizeHandleSizeChange: function (val) {
                this.ramSizePageSize = val;
                this.ramSizeLoadData(this.criteria, this.ramSizeCurrentPage, this.ramSizePageSize);
            },

            // 页码变更, 如第1页变成第2页时,val=2
            ramSizeHandleCurrentChange: function (val) {
                this.ramSizeCurrentPage = val;
                this.ramSizeLoadData(this.criteria, this.ramSizeCurrentPage, this.ramSizePageSize);
            },

            toUpperCase: function (item) {
                this.ramSizeForm.label = this.ramSizeForm.label.toUpperCase();
            },

            // 显示新增界面
            ramTypeHandleAdd: function (index, row) {
                this.ramTypeAddFormVisible = true;
                this.ramTypeForm.id = '';
                this.ramTypeForm.label = ''
            },

            // 新增
            ramTypeAddSubmit: function () {
                var _this = this;
                this.$refs.ramTypeForm.validate((valid) => {
                    if (valid) {
                        var addFormParams = getRamTypeFormParams(_this);
                        // console.log(addFormParams);
                        ramTypeAdd(_this, addFormParams)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            ramSizeHandleAdd: function (index, row) {
                this.ramSizeAddFormVisible = true;
                this.ramSizeForm.id = '';
                this.ramSizeForm.label = ''
            },

            ramSizeAddSubmit: function () {
                var _this = this;
                this.$refs.ramSizeForm.validate((valid) => {
                    if (valid) {
                        var addFormParams = getRamSizeFormParams(_this);
                        // console.log(addFormParams);
                        ramSizeAdd(_this, addFormParams)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 取消
            ramTypeCancelAdd: function () {
                this.ramTypeAddFormVisible = false;
                this.$message({
                    showClose: true,
                    message: '已取消新增'
                });
            },
            ramSizeCancelAdd: function () {
                this.ramSizeAddFormVisible = false;
                this.$message({
                    showClose: true,
                    message: '已取消新增'
                });
            },

            // 单行删除
            ramTypeHandleDelete: function (index, row) {
                var id = row.id;
                this.$confirm('确定要删除该条记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    ramTypeDel(this, id);
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: '已取消删除操作'
                    });
                });
            },

            ramSizeHandleDelete: function (index, row) {
                var id = row.id;
                this.$confirm('确定要删除该条记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    ramSizeDel(this, id);
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
    app.ramTypeLoadData(app.criteria, app.ramTypeCurrentPage, app.ramTypePageSize);
    app.ramSizeLoadData(app.criteria, app.ramSizeCurrentPage, app.ramSizePageSize);

});

function getRamTypeFormParams(_this) {
    var q = "";
    var formData = _this.ramTypeForm;
    for (var item in formData) {
        q += item + "=" + formData[item] + "&";
    }
    q = q.substring(0, q.length - 1);
    return q;
}
function ramTypeAdd(_this, formParams) {
    $.post("addRamType", formParams, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已成功添加了一条记录',
                type: 'success'
            });
            _this.ramTypeAddFormVisible = false;
            _this.ramTypeLoadData(_this.criteria, _this.ramTypeCurrentPage, _this.ramTypePageSize);
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
function ramTypeDel(_this, id) {
    $.post("delRamType", {id: id}, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已删除成功',
                type: 'success'
            });
            _this.ramTypeLoadData(_this.criteria, _this.ramTypeCurrentPage, _this.ramTypePageSize);
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

function getRamSizeFormParams(_this) {
    var q = "";
    var formData = _this.ramSizeForm;
    for (var item in formData) {
        q += item + "=" + formData[item] + "&";
    }
    q = q.substring(0, q.length - 1);
    return q;
}
function ramSizeAdd(_this, formParams) {
    $.post("addRamSize", formParams, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已成功添加了一条记录',
                type: 'success'
            });
            _this.ramSizeAddFormVisible = false;
            _this.ramSizeLoadData(_this.criteria, _this.ramSizeCurrentPage, _this.ramSizePageSize);
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
function ramSizeDel(_this, id) {
    $.post("delRamSize", {id: id}, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已删除成功',
                type: 'success'
            });
            _this.ramSizeLoadData(_this.criteria, _this.ramSizeCurrentPage, _this.ramSizePageSize);
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