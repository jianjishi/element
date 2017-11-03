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

            initTree: {},

            // 列表页
            searchForm: {
                name: ''
            },

            // 新增页
            addFormVisible: false,// 新增界面是否显示
            // 新增界面数据
            roleForm: {
                id: '',
                name: '',
                remarks: '',
                useable: 0,
                menuIds: [],
                menuAllIds: [],
            },
            roleFormRules: {
                name: [
                    {required: true, message: '请输入角色名称', trigger: 'blur'}
                ],
                remarks: [
                    {required: true, message: '请输入备注', trigger: 'blur'}
                ]
            },
            filterText: '',
            data2: menuTree,
            defaultProps: {
                children: 'children',
                label: 'label'
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
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            // 从服务器读取数据
            loadData: function (criteria, currentPage, pageSize) {
                criteria['currentPage'] = currentPage;
                criteria['pageSize'] = pageSize;
                // console.log(criteria); // {currentPage:1, pageSize:10, userMsg: "aaa"}
                this.$http.get("get_roles_json", criteria).then(function (res) {
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
                window.location.href = localStorage.getItem("adminPath") + "/manage/role/index";
            },

            // 重置
            handleReset: function () {
                this.$refs.searchForm.resetFields();
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

            // 过滤权限值
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            // 显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.roleForm.id = '';
                this.roleForm.name = '';
                this.roleForm.remarks = '';
                this.roleForm.useable = 0;
                this.roleForm.menuIds = [];
                this.roleForm.menuAllIds = [];
            },

            // 新增
            addSubmit: function () {
                var _this = this;
                this.roleForm.menuIds = this.$refs.tree.getCheckedKeys();
                this.$refs.roleForm.validate((valid) => {
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

            resetAdd: function () {
                this.$refs['roleForm'].resetFields();
                this.$refs.tree.setCheckedKeys([]);
            },

            // 显示编辑页面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                // console.log(row);
                this.roleForm.id = row.id;
                this.roleForm.name = row.name;
                this.roleForm.remarks = row.remarks;
                this.roleForm.useable = row.useable;
                this.roleForm.menuIds = row.menuIds;
                var _this = this;
                Vue.nextTick(function () {
                    _this.$refs.editTree.setCheckedKeys(_this.roleForm.menuIds);
                })
            },

            // editSubmit
            editSubmit: function () {
                var _this = this;
                this.roleForm.menuIds = this.$refs.editTree.getCheckedKeys();
                this.$refs.roleForm.validate((valid) => {
                    if (valid) {
                        var editFormParams = getFormParams(_this);
                        update(_this, editFormParams);
                        console.log("submit", editFormParams);
                    } else {
                        alert("al");
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
                this.$refs.tree.setCheckedKeys([]);
                this.$refs['roleForm'].resetFields();
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
            },

        }
    });
    //载入数据
    app.loadData(app.criteria, app.currentPage, app.pageSize);
    app.initTree = searchInit(app.data2);          //立即处理权限列表
});


//权限列表json的处理
function searchInit(json) {
    var newJson = json.concat([]);
    var len = newJson.length;   //长度
    var parentNode = [];
    console.log('newJson', newJson);
    for (var i = 0; i < len; i++) {
        var item = newJson[i];
        if (item.children && item.children.length != 0) {
            var child = item.children;
            for (var j = 0; j < child.length; j++) {
                if (item.parentNode) {
                    child[j].parentNode = item.parentNode.concat([item.id]);
                }
                else {
                    child[j].parentNode = [item.id]
                }
                console.log(item.parentNode, item.id);
                newJson[len + j] = child[j];
            }
            len = newJson.length;
        }
    }
    return newJson;

}

//搜索当前权限，获得所有父级权限id
function searchTree(json, id) {
console.log("tree",json);
    var newJson = json.concat([]);
    var len = newJson.length;   //长度
    console.log("json",len);
    var parentNode = [];
    //查找id
    for (var s = 0; s < len; s++) {
        if (newJson[s].id == id) {
            if (newJson[s].parentNode == null || newJson[s].parentNode.length == 0) {
                parentNode = [];
            }
            else {
                parentNode = newJson[s].parentNode;
            }
        }
        else {
            continue;
        }
    }
    return parentNode;
}

//获取最终所有权限列表id
//json :最初的权限列表
//keys :用户点击获取Vue获取到的最底层权限id数组
function getKeys(json, keys) {
    var final = [];
    for (var i = 0; i < keys.length; i++) {
        var final = searchTree(json, keys[i]).concat(final);
    }
    if (json.length == 0 || keys.length == 0) {
        return [];
    }
    else {
        var c = $.unique((final.concat(keys)).sort());
        return  c;
    }
}
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
    var formData = _this.roleForm;
    var nowId = _this.roleForm.menuIds;
    // var oldTree = _this.data2;
    var oldTree = _this.initTree;

    formData.menuAllIds = getKeys(oldTree, nowId);
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