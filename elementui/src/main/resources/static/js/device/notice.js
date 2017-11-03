/**
 * Created by winfan on 17/8/2.
 */

$(function () {
    var vue = new Vue({
        el: "#app",
        data: {
            // 表格当前页数据
            tableData: [],
            // 多选数组
            multipleSelection: [],
            // 请求的URL
            url: 'get_notice_json',
            //搜索条件
            criteria: '',

            // 新增页
            addFormVisible: false,// 新增界面是否显示
            addLoading: false,
            //新增界面数据
            noticeForm: {
                id:"",
                url:"",
                requestType:"",
                isEnableEmailNotice:"",
                status:"",
                args:"",
                remarks:""
            },
            noticeFormRules: {

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
            // 默认高亮行数据id
            highlightId: -1
        },
        methods: {
            // 从服务器读取数据
            loadData: function (criteria, pageNum, pageSize) {
                this.$http.get(this.url, {
                    parameter: criteria,
                    pageNum: (pageNum - 1) * 10,
                    pageSize: pageSize
                }).then(function (res) {
                    this.tableData = res.data.lists;
                    this.totalCount = res.data.count;
                }, function () {
                    console.log('failed');
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

            // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
            handleSizeChange: function (val) {
                this.pageSize = val;
                this.loadData(this.criteria, this.currentPage, this.pageSize);
            },

            cancelAdd:function () {
              alert(123)
            },
            cancelEdit:function () {
              alert(1)
            },
            editSubmit:function () {
                var _this = this;
                this.$refs.noticeForm.validate((valid) => {
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
            // 页码变更, 如第1页变成第2页时,val=2
            handleCurrentChange: function (val) {
                this.currentPage = val;
                this.loadData(this.criteria, this.currentPage, this.pageSize);
            },

            // 搜索,提交表单
            submitForm: function () {
                // todo:表单验证方法
                var _this = this;
                this.$refs.indexForm.validate(function (result) {
                    if (result) {
                        console.log(_this.indexForm);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 刷新
            handleRefresh: function () {
                window.location.href = localStorage.getItem("adminPath") + "/device/notice/index";
            },

            // 取消
            cancel: function () {
                this.addFormVisible = false;
                this.$notify.info({
                    title: '消息',
                    message: '已取消新增'
                });
            },


            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.noticeForm.id = '';
                this.noticeForm.url = '';
                this.noticeForm.args = '';
                this.noticeForm.requestType = '';
                this.noticeForm.isEnableEmailNotice = '';
                this.noticeForm.status = '';
                this.noticeForm.remarks = '';
            },



            // 新增
            addSubmit: function () {
                var _this = this;
                this.$refs.noticeForm.validate(function (result) {
                    var addFormParams = getFormParams(_this);
                    console.log(addFormParams);
                    if (result) {
                        add(_this, addFormParams)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //编辑
            handleEdit: function (index, row) {
                var _this = this;
                this.editFormVisible = true;
                // console.log(row);
                this.noticeForm.id = row.id;
                this.noticeForm.url = row.url;
                this.noticeForm.requestType = row.requestType;
                this.noticeForm.isEnableEmailNotice = row.isEnableEmailNotice;
                this.noticeForm.status = row.status;
                this.noticeForm.remarks = row.remarks;
                this.noticeForm.args = row.args;
            },

            //单行删除
            handleDelete: function (index, row) {
                var _this = this;
                var id = row.id;
                this.$confirm('确定要删除该条记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(()=>{del(_this, id)}
                ).catch(() => {
                    this.$message({
                        showClose: true,
                        message: '已取消删除操作'
                    });
                });
            }

        }
    });
    //载入数据
    vue.loadData(vue.criteria, vue.currentPage, vue.pageSize);

});

function getFormParams(_this) {
    var q = "";
    var formData = _this.noticeForm;
    for (var item in formData) {
        q += item + "=" + formData[item] + "&";
    }
    q = q.substring(0, q.length - 1);
    return q;
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