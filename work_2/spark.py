# coding:utf-8
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import DecimalType, TimestampType
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
import os
import math
from Crawler import *
import sys
import importlib

importlib.reload(sys)
sys.stdout.reconfigure(encoding='utf-8')


def passed_rain_analyse(filename):  # 计算各个城市过去24小时累积雨量
    print("Begin to analyse passed rain")
    spark = SparkSession.builder.master("local").appName("passed_rain_analyse").getOrCreate()
    df = spark.read.csv(filename, header=True)
    df_rain = df.select(df['province'], df['city_name'], df['city_code'], df['rain1h'].cast(DecimalType(scale=1))) \
        .filter(df['rain1h'] < 1000)  # 筛选数据，去除无效数据
    df_rain_sum = df_rain.groupBy("province", "city_name", "city_code") \
        .agg(F.sum("rain1h").alias("rain24h")) \
        .sort(F.desc("rain24h"))  # 分组、求和、排序
    df_rain_sum.cache()
    # 修改路径为Windows下的路径
    df_rain_sum.coalesce(1).write.csv("D:/Program Files/bigData/bigWork/work_2/out/passed_rain_analyse.csv", header=True)
    print("End analysing passed rain")
    return df_rain_sum.head(20)


def passed_temperature_analyse(filename):
    print("Begin to analyse passed temperature")
    spark = SparkSession.builder.master("local").appName("passed_temperature_analyse").getOrCreate()
    df = spark.read.csv(filename, header=True)
    df_temperature = df.select(  # 选择需要的列
        df['province'],
        df['city_name'],
        df['city_code'],
        df['temperature'].cast(DecimalType(scale=1)),
        F.date_format(df['time'], "yyyy-MM-dd").alias("date"),  # 得到日期数据
        F.hour(df['time']).alias("hour")  # 得到小时数据
    )
    # 筛选四点时次
    df_4point_temperature = df_temperature.filter(df_temperature['hour'].isin([2, 8, 12, 20]))
    df_avg_temperature = df_4point_temperature.groupBy("province", "city_name", "city_code", "date") \
        .agg(F.count("temperature"), F.avg("temperature").alias("avg_temperature")) \
        .filter("count(temperature) = 4") \
        .sort(F.asc("avg_temperature")) \
        .select("province", "city_name", "city_code", "date", F.format_number('avg_temperature', 1).alias("avg_temperature"))
    df_avg_temperature.cache()
    avg_temperature_list = df_avg_temperature.collect()
    # 修改路径为Windows下的路径
    df_avg_temperature.coalesce(1).write.json("D:/Program Files/bigData/bigWork/work_2/out/passed_rain_temperature.json")
    print("End analysing passed temperature")
    return avg_temperature_list[0:10]


def draw_rain(rain_list):
    print("Begin to draw the picture of passed rain")
    font = FontProperties(fname='ttf/simhei.ttf')  # 设置字体
    name_list = []
    num_list = []
    for item in rain_list:
        name_list.append(item.province[:2] + '\n' + item.city_name)
        num_list.append(item.rain24h)
    index = [i + 0.25 for i in range(len(num_list))]
    # 修改颜色列表为有效的颜色
    rects = plt.bar(index, num_list, color=['r', 'g', 'b', 'y'], width=0.5)
    plt.xticks([i + 0.25 for i in index], name_list, fontproperties=font)
    plt.ylim(ymax=(int(max(num_list) + 100) // 100) * 100, ymin=0)
    plt.xlabel("城市", fontproperties=font)
    plt.ylabel("雨量", fontproperties=font)
    plt.title("过去24小时累计降雨量全国前20名", fontproperties=font)
    for rect in rects:
        height = rect.get_height()
        plt.text(rect.get_x() + rect.get_width() / 2, height + 1, str(height), ha="center", va="bottom")
    plt.show()
    print("Ending drawing the picture of passed rain")


def draw_temperature(temperature_list):
    print("Begin to draw the picture of passed temperature")
    font = FontProperties(fname='ttf/simhei.ttf')
    name_list = []
    num_list = []
    date = temperature_list[0].date
    for item in temperature_list:
        name_list.append(item.province[:2] + '\n' + item.city_name)
        num_list.append(float(item.avg_temperature))
    index = [i + 0.25 for i in range(len(num_list))]
    # 修改颜色列表为有效的颜色
    rects = plt.bar(index, num_list, color=['r', 'g', 'b', 'y'], width=0.5)
    plt.xticks([i + 0.25 for i in index], name_list, fontproperties=font)
    plt.ylim(ymax=math.ceil(float(max(num_list))*2.7), ymin=0)
    plt.xlabel("城市", fontproperties=font)
    plt.ylabel("日平均气温", fontproperties=font)
    plt.title(f"{date}全国日平均气温最低前10名", fontproperties=font)
    for rect in rects:
        height = rect.get_height()
        plt.text(rect.get_x() + rect.get_width() / 2, height + 0.1, str(height), ha="center", va="bottom")
    plt.show()
    print("Ending drawing the picture of passed temperature")


def main():
    sourcefile = "input/passed_weather_ALL.csv"
    if not os.path.exists(sourcefile):
        crawler = Crawler()
        crawler.run('ALL')
    rain_list = passed_rain_analyse('file:///D:/Program Files/bigData/bigWork/work_2/' + sourcefile)
    draw_rain(rain_list)
    temperature_list = passed_temperature_analyse('file:///D:/Program Files/bigData/bigWork/work_2/' + sourcefile)
    draw_temperature(temperature_list)


if __name__ == '__main__':
    main()
