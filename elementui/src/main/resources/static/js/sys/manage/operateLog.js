$(function () {
    var app = new Vue({
        el: "#app",
        data: {
            // 表格当前页数据
            tableData: [],
            //搜索条件
            criteria: {},

            // 列表页
            searchForm: {
                loginName: ''
            },

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
                this.$http.get("get_operateLogs_json", criteria).then(function (res) {
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
                window.location.href = localStorage.getItem("adminPath") + "/manage/operateLog/index";
            },

            // 重置
            handleReset: function () {
                this.$refs.searchForm.resetFields();
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