package com.coocaa.element.core.utils;

import java.util.regex.Pattern;

/**
 * Created by guanguan on 2017/7/4.
 */
public class RamUtil {

    public static Integer getRamSize(String ramSize) {
        Integer size = 0;
        if (ramSize.contains("m")) {
            size = Integer.parseInt(ramSize.substring(0, ramSize.indexOf("m")));
        }
        if (ramSize.contains("g")) {
            Integer size0 = Integer.parseInt(ramSize.substring(0, ramSize.indexOf("g")));
            size = size0 * 1024;
        }
        return size;
    }


    public static boolean containsRamSize(String[] ramSizes, String ramSize) {
        String ram = ramSize.toLowerCase();
        for (String item : ramSizes) {
            if (item.toLowerCase().equals(ram)) {
                return true;
            }


        }
        return false;
    }


    public static boolean compareRamSize(String ramSize1, String ramSize2) {
        Integer size1 = getRamSize(ramSize1);
        Integer size2 = getRamSize(ramSize2);
        if (size1 >= size2) {
            return false;
        } else {
            return true;
        }
    }


    public static boolean isInteger(String str) {
        Pattern pattern = Pattern.compile("^[-\\+]?[\\d]*$");
        return pattern.matcher(str).matches();
    }


    public static boolean isDouble(String str) {
        Pattern pattern = Pattern.compile("^[-\\+]?[.\\d]*$");
        return pattern.matcher(str).matches();
    }


    public static boolean isLetterDigitOrChinese(String str) {
        String regex = "^[a-z0-9A-Z\u4e00-\u9fa5]+$";//其他需要，直接修改正则表达式就好
        return str.matches(regex);
    }

    public static boolean vd(String str){

        char[] chars=str.toCharArray();
        boolean isGB2312=false;
        for(int i=0;i<chars.length;i++){
            byte[] bytes=(""+chars[i]).getBytes();
            if(bytes.length==2){
                int[] ints=new int[2];
                ints[0]=bytes[0]& 0xff;
                ints[1]=bytes[1]& 0xff;

                if(ints[0]>=0x81 && ints[0]<=0xFE &&
                        ints[1]>=0x40 && ints[1]<=0xFE){
                    isGB2312=true;
                    break;
                }
            }
        }
        return isGB2312;
    }


}
