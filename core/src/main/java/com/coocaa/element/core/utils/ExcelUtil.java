package com.coocaa.element.core.utils;

import jxl.Workbook;
import jxl.format.Alignment;
import jxl.format.VerticalAlignment;
import jxl.write.*;
import org.apache.log4j.Logger;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

/**
 * Created by guanguan on 2017/7/4.
 */
public class ExcelUtil {

    private static Logger logger = Logger.getLogger(ExcelUtil.class);

    public static HashMap<String, Object> initWorkBook(String path, String title, String[] headerArr) {
        HashMap<String, Object> rtn = new HashMap<>();
        File file = new File(path);
        WritableWorkbook book;
        try {
            if (!file.exists()) {
                file.getParentFile().mkdirs();
            }
            // 打开文件
            book = Workbook.createWorkbook(file);
            // 生成名为“第一页”的工作表，参数0表示这是第一页
            WritableSheet sheet = book.createSheet("第一页", 0);
            WritableFont font1 = new WritableFont(WritableFont.createFont("微软雅黑"), 10, WritableFont.BOLD);
            WritableFont font2 = new WritableFont(WritableFont.createFont("微软雅黑"), 9, WritableFont.NO_BOLD);
            WritableCellFormat wcf1 = new WritableCellFormat(font1);
            WritableCellFormat wcf2 = new WritableCellFormat(font2);
            wcf1.setAlignment(Alignment.CENTRE);  //平行居中
            wcf1.setVerticalAlignment(VerticalAlignment.CENTRE);  //垂直居中
            wcf2.setAlignment(Alignment.CENTRE);  //平行居中
            wcf2.setVerticalAlignment(VerticalAlignment.CENTRE);  //垂直居中
            // mergeCells(a,b,c,d)=单元格合并函数: a 单元格的列号; b 单元格的行号; c 从单元格[a,b]起，向下合并的列数; d 从单元格[a,b]起，向下合并的行数
            sheet.mergeCells(0, 0, headerArr.length, 0);
            Label titleLabel = new Label(0, 0, title, wcf1);
            // 将定义好的单元格添加到工作表中
            sheet.addCell(titleLabel);
            sheet.setRowView(1, 500); // 设置第一行的高度
            for (int i = 0; i < headerArr.length; i++) {
                sheet.addCell(new Label(i, 1, headerArr[i], wcf1));
                sheet.setColumnView(i, 20);
            }
            rtn.put("status", 1);
            rtn.put("book", book);
            rtn.put("sheet", sheet);
            rtn.put("writableCellFormat", wcf2);
            return rtn;
        } catch (IOException e) {
            e.printStackTrace();
            logger.debug("打开或新建文件时出错");
            rtn.put("status", 0);
            return rtn;
        } catch (WriteException e) {
            e.printStackTrace();
            rtn.put("status", 0);
            return rtn;
        }
    }

    public static void writeAndCloseWorkBook(WritableWorkbook workbook) {
        try {
            workbook.write();
            workbook.close();
        } catch (IOException e) {
            e.printStackTrace();
            logger.debug("关闭workbook时出错");
        }
    }
}
