$(function () {
    Vue.component('pagination', {
        props: ['currentpage', 'pagesize', 'totalcount', 'handlesizechange', 'handlecurrentchange'],
        template: '<el-pagination @size-change="handlesizechange" @current-change="handlecurrentchange" ' +
        ':current-page="currentpage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" ' +
        'layout="total, sizes, prev, pager, next, jumper" :total="totalcount"></el-pagination>'
    });
});