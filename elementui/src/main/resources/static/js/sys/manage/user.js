$(function () {
    // Vue.component('customtag', {
    //     props: ['customattribute'],
    //     template: '<el-checkbox :label="customattribute.id" name="roleIds">{{ customattribute.name }}</el-checkbox>'
    // })
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
                userMsg: ''
            },

            // 新增页
            addFormVisible: false,// 新增界面是否显示
            // 新增界面数据
            userForm: {
                id: '',
                name: '',
                loginName: '',
                email: '',
                password: '',
                officeId: '',
                remarks: '',
                loginFlag: 0,
                mailNotice: false,
                roleIds: [], // 该用户所拥有的角色id
                // 以上为表单提交的参数

                officeName: '', // 机构名称
                roleList: roleList // 角色列表
            },
            userFormRules: {
                name: [
                    {required: true, message: '请输入真实姓名', trigger: 'blur'}
                ],
                loginName: [
                    {required: true, message: '请输入登录账号', trigger: 'blur'}
                ],
                email: [
                    {required: true, message: '请输入邮箱', trigger: 'blur'}
                ],
                // password: [
                //     {required: true, message: '请输入密码', trigger: 'blur'}
                // ],
                roleIds: [
                    {type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change'}
                ],
                officeName: [
                    {required: true, message: '请选择所属部门', trigger: 'blur'}
                ],
                remarks: [
                    {required: true, message: '请输入备注信息', trigger: 'blur'}
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
                this.$http.get("get_users_json", criteria).then(function (res) {
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
                window.location.href = localStorage.getItem("adminPath") + "/manage/user/index";
            },

            // 重置
            handleReset: function () {
                this.$refs.searchForm.resetFields();
            },

            // 修改状态
            handleChangetStatus: function (index, row) {
                var id = row.id;
                var loginFlag = row.loginFlag == 1 ? 0 : 1;
                this.$confirm('确定修改该条记录的状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    changeStatus(this, id, loginFlag);
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

            // 选择所属机构
            selectOffice: function () {
                var _this = this;
                layer.open({
                    type: 2,
                    title: '请选择机构',
                    area: ['300px', '450px'],
                    fixed: true,
                    maxmin: true,
                    content: localStorage.getItem("adminPath") + '/manage/office/officeTreeSelect',
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {
                        var selectedOfficeObj = $(window.frames["layui-layer-iframe" + index].document).find("#selectedOffice");
                        var officeId = selectedOfficeObj[0].dataset.id;
                        var officeName = selectedOfficeObj[0].dataset.name;
                        if (officeId == undefined) {
                            layer.alert("请选择机构");
                        } else {
                            _this.userForm.officeName = officeName;
                            _this.userForm.officeId = officeId;
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
                this.userForm.id = '';
                this.userForm.name = '';
                this.userForm.loginName = '';
                this.userForm.email = '';
                this.userForm.password = '';
                this.userForm.officeId = '';
                this.userForm.remarks = '';
                this.userForm.loginFlag = 0;
                this.userForm.officeName = '';
                this.userForm.roleIds = [];
            },

            // 新增
            addSubmit: function () {
                var _this = this;
                this.$refs.userForm.validate((valid) => {
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
                this.userForm.id = row.id;
                this.userForm.name = row.name;
                this.userForm.loginName = row.loginName;
                this.userForm.email = row.email;
                this.userForm.password = "";
                this.userForm.officeId = row.officeId;
                this.userForm.remarks = row.remarks;
                this.userForm.loginFlag = row.loginFlag;
                this.userForm.officeName = row.officeName;
                this.userForm.roleIds = row.roleIds;
            },

            // editSubmit
            editSubmit: function () {
                var _this = this;
                this.$refs.userForm.validate((valid) => {
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
    var formData = _this.userForm;
    for (var item in formData) {
        if (item == "officeName" || item == "roleList") {
            continue;
        }
        q += item + "=" + formData[item] + "&";
    }
    q = q.substring(0, q.length - 1);
    return q;
}
function changeStatus(_this, id, loginFlag) {
    $.post("changeStatus", {id: id, loginFlag: loginFlag}, function (a, b) {
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
function batchdel(_this, ids) { // {ids: ids} 数组这样传,后端是接收不到的
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