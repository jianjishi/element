$(function () {
    var app = new Vue({
        el: "#app",
        data: {
            // 表格当前页数据
            tableData: [],
            //搜索条件
            criteria: {},

            // 新增页
            addFormVisible: false,// 新增界面是否显示
            // 新增界面数据
            wifiForm: {
                id: '',
                modelName: '',
                wifiSupportValues: [],
                // 以上为表单提交的参数

                tvWifiSupportList: tvWifiSupportList
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
                this.$http.get("get_wifis_json", criteria).then(function (res) {
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

            support5gFormat: function (row, column) {
                var flag = false;
                var wifiConfigList = row.wifiConfigList;
                for (wifiConfig in wifiConfigList) {
                    if (wifiConfigList[wifiConfig].value == "tv_support_5g") {
                        flag = true;
                        return "是";
                    }
                }
                if (flag == false) {
                    return "否";
                }
            },
            supportReDianFormat: function (row, column) {
                var flag = false;
                var wifiConfigList = row.wifiConfigList;
                for (wifiConfig in wifiConfigList) {
                    if (wifiConfigList[wifiConfig].value == "tv_support_redian") {
                        flag = true;
                        return "是";
                    }
                }
                if (flag == false) {
                    return "否";
                }
            },

            // 显示新增界面
            handleAdd: function (index, row) {
                this.addFormVisible = true;
                this.wifiForm.id = '';
                this.wifiForm.modelName = '';
                this.wifiForm.wifiSupportValues = [];
            },

            // 新增
            addSubmit: function () {
                var _this = this;
                this.$refs.wifiForm.validate((valid) => {
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

            // 显示新增界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.wifiForm.id = row.id;
                this.wifiForm.modelName = row.modelName;
                this.wifiForm.wifiSupportValues = row.tvWifiSupports;
            },

            // 新增
            editSubmit: function () {
                var _this = this;
                this.$refs.wifiForm.validate((valid) => {
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
    app.loadData(app.criteria, app.currentPage, app.pageSize);

});

function getFormParams(_this) {
    var q = "";
    var formData = _this.wifiForm;
    for (var item in formData) {
        if (item == "tvWifiSupportList") {
            continue;
        }
        q += item + "=" + formData[item] + "&";
        if (item == "wifiSupportValues") {
            var wifiSupportLabels = [];
            for (var i = 0; i < tvWifiSupportList.length; i++) {
                if (formData[item].indexOf(tvWifiSupportList[i].value) != -1) {
                    wifiSupportLabels.push(tvWifiSupportList[i].label);
                }
            }
            q += "wifiSupportLabels=" + wifiSupportLabels + "&";
        }
    }
    q = q.substring(0, q.length - 1);
    return q;
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