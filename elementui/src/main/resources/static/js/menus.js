$(function () {
    //$("#iframe").css("height", $(window).height() - 50);
    var menus = $("#side-menu");
    $(_menus).each(function () {
        var _this = this;
        var li = '<li class= "active">';
        if(this.url == "") {
            li += '<a href="#">';
        } else {
            li += '<a class="J_menuItem" href="' + localStorage.getItem("adminPath") + this.url + '">';
        }
        li += '<i class="fa ' + _this.icons + '"></i><span>' + _this.name + '</span>';
        if (this.child.length > 0) {
            li += '<span class="fa arrow" style="float: right"></span></a>';
            li += '<ul class="nav nav-second-level">';
            $(_this.child).each(function () {
                li += '<li>';
                if(this.url == "") {
                    li += '<a href="#">';
                } else {
                    li += '<a class="J_menuItem" href="' + localStorage.getItem("adminPath") + this.url + '">';
                }
                li += '<i class="fa ' + this.icons + '"></i><span>' + this.name + '</span>';
                var xthis = this;
                if (xthis.child.length > 0) {
                    li += '<i class="fa fa-angle-double-left" style="float: right"></i></a>';
                    li += '<ul class="nav nav-third-level">';
                    $(xthis.child).each(function () {
                        li += '<li><a class="J_menuItem" href="' + localStorage.getItem("adminPath") + this.url + '"><i class="fa ' + this.icons + '"></i> ' + this.name + '</a></li>';
                    });
                    li += '</ul>';
                }
                li += '</li>';
            });
            li += '</ul>';
        } else {
            li += '</a>';
        }
        li += '</li>';
        menus.append(li);
    });
});
