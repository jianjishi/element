package com.coocaa.element.common.util;

/**
 * Created by panwei on 2017/6/16.
 */
public class EmailTemplatesUtil {

    public static String getRegisterTemplate(String loginName, String remarks, String webSite) {
        StringBuffer sb = new StringBuffer();
        sb.append("<html lang=\"zh-cn\">")
                .append("<head>")
                .append("<meta http-equiv=\"content-type\" content=\"text/html;charset=utf8\"/>")
                .append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>")
                .append("</head>")
                .append("<body>")
                .append("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">")
                .append("<tr>")
                .append("<td>")
                .append("<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"border-collapse: collapse;\">")
                .append("<tr>")
                .append("<td>")
                .append("新用户" + loginName + "注册了，<br>")
                .append("申请理由是:<br>")
                .append(remarks + "，<br>")
                .append("请速到设备报备系统<a href=\"" + webSite + "user/index\">(" + webSite + "user/index)</a>进行处理.<br>")
                .append("如果您的email程序不支持链接点击，请将上面的地址拷贝至您的浏览器(如IE)的地址栏进入。")
                .append("</td>")
                .append("</tr>")
                .append("<tr>")
                .append("<td>")
                .append("-----------------------<br>")
                .append("(这是一封自动产生的email，请勿回复。)")
                .append("</td>")
                .append("</tr>")
                .append("</table>")
                .append("</td>")
                .append("</tr>")
                .append("</table>")
                .append("</body>")
                .append("</html>");
        return sb.toString();
    }

    public static String getAddUserTemplate(String loginName, String webSite) {
        StringBuffer sb = new StringBuffer();
        sb.append("<html lang=\"zh-cn\">")
                .append("<head>")
                .append("<meta http-equiv=\"content-type\" content=\"text/html;charset=utf8\"/>")
                .append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>")
                .append("</head>")
                .append("<body>")
                .append("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">")
                .append("<tr>")
                .append("<td>")
                .append("亲爱的" + loginName + ":")
                .append("</td>")
                .append("</tr>")
                .append("<tr>")
                .append("<td>")
                .append("<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"border-collapse: collapse;\">")
                .append("<tr>")
                .append("<td>")
                .append("&nbsp&nbsp欢迎加入设备报备系统<br>")
                .append("&nbsp&nbsp当您收到这封信的时候, 您已经可以正常登录了。请点击链接登录首页:")
                .append("&nbsp&nbsp设备报备系统<a href=\"" + webSite + "\">(" + webSite + ")。</a><br>")
                .append("&nbsp&nbsp如果您的email程序不支持链接点击，请将上面的地址拷贝至您的浏览器(如IE)的地址栏进入。<br>")
                .append("&nbsp&nbsp如果您还想申请管理员权限，可以联系管理员。<br>")
                .append("&nbsp&nbsp我们对您产生的不便，深表歉意。<br>")
                .append("&nbsp&nbsp希望您在设备报备系统度过快乐的时光!<br>")
                .append("</td>")
                .append("</tr>")
                .append("<tr>")
                .append("<td>")
                .append("-----------------------<br>")
                .append("(这是一封自动产生的email，请勿回复。)")
                .append("</td>")
                .append("</tr>")
                .append("</table>")
                .append("</td>")
                .append("</tr>")
                .append("</table>")
                .append("</body>")
                .append("</html>");
        return sb.toString();
    }

    public static String getLockUserTemplate(String loginName, Integer loginFlag) {
        String remark;
        if (loginFlag.equals(1)) {
            remark = "您好, " + loginName + ", 当您收到这封邮件的时候, 您就可以正常登陆了!<br>";
        } else {
            remark = "对不起, " + loginName + "用户已被锁定!<br>";
        }
        StringBuffer sb = new StringBuffer();
        sb.append("<html lang=\"zh-cn\">")
                .append("<head>")
                .append("<meta http-equiv=\"content-type\" content=\"text/html;charset=utf8\"/>")
                .append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>")
                .append("</head>")
                .append("<body>")
                .append("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">")
                .append("<tr>")
                .append("<td>")
                .append("<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"border-collapse: collapse;\">")
                .append("<tr>")
                .append("<td>")
                .append(remark)
                .append("</td>")
                .append("</tr>")
                .append("<tr>")
                .append("<td>")
                .append("-----------------------<br>")
                .append("(这是一封自动产生的email，请勿回复。)")
                .append("</td>")
                .append("</tr>")
                .append("</table>")
                .append("</td>")
                .append("</tr>")
                .append("</table>")
                .append("</body>")
                .append("</html>");
        return sb.toString();
    }

}
