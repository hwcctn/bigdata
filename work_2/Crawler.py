# coding:utf-8
import urllib.request
import urllib.error
import json
import csv
import chardet
import codecs
import os
import time
import sys
import importlib

importlib.reload(sys)

class Crawler:
    def get_html(self, url):
        request = urllib.request.Request(url)
        try:
            response = urllib.request.urlopen(request)
            content = response.read()
            encoding = chardet.detect(content)['encoding']
            if not encoding:
                encoding = 'utf-8'
            return content.decode(encoding)
        except urllib.error.URLError as e:
            print(f"Failed to fetch {url}: {e}")
            return None

    def parse_json(self, url):
        obj = self.get_html(url)
        if obj:
            json_obj = json.loads(obj)
        else:
            json_obj = []
        return json_obj

    def write_csv(self, file, data):
        if data:
            print(f"Begin to write to {file}")
            with open(file, 'a+', newline='', encoding='utf-8') as f:
                f.write(codecs.BOM_UTF8.decode('utf-8'))
                f_csv = csv.DictWriter(f, fieldnames=data[0].keys())
                if not os.path.exists(file) or f.tell() == 0:
                    f_csv.writeheader()
                f_csv.writerows(data)
            print(f"End to write to {file}")

    def write_header(self, file, data):
        if data:
            print(f"Begin to write to {file}")
            with open(file, 'a+', newline='', encoding='utf-8') as f:
                f.write(codecs.BOM_UTF8.decode('utf-8'))
                f_csv = csv.DictWriter(f, fieldnames=data[0].keys())
                f_csv.writeheader()
                f_csv.writerows(data)
            print(f"End to write to {file}")

    def write_row(self, file, data):
        if data:
            print(f"Begin to write to {file}")
            with open(file, 'a+', newline='', encoding='utf-8') as f:
                f.write(codecs.BOM_UTF8.decode('utf-8'))
                f_csv = csv.DictWriter(f, fieldnames=data[0].keys())
                f_csv.writerows(data)
            print(f"End to write to {file}")

    def read_csv(self, file):
        print(f"Begin to read {file}")
        with open(file, 'r', encoding='utf-8') as f:
            data = list(csv.DictReader(f))
            print(f"End to read {file}")
            return data

    def get_provinces(self):
        province_file = 'input/province.csv'
        if not os.path.exists(province_file):
            print("Begin crawl province")
            provinces = self.parse_json('http://www.nmc.cn/f/rest/province')
            print("End crawl province")
            self.write_csv(province_file, provinces)
        else:
            provinces = self.read_csv(province_file)
        return provinces

    def get_cities(self):
        city_file = 'input/city.csv'
        if not os.path.exists(city_file):
            cities = []
            print("Begin crawl city")
            for province in self.get_provinces():
                print(province['name'])
                url = province['url'].split('/')[-1].split('.')[0]
                cities.extend(self.parse_json(f'http://www.nmc.cn/f/rest/province/{url}'))
            self.write_csv(city_file, cities)
            print("End crawl city")
        else:
            cities = self.read_csv(city_file)
        return cities

    def get_passed_weather(self, province):
        weather_passed_file = f'input/passed_weather_{province}.csv'
        if os.path.exists(weather_passed_file):
            return
        passed_weather = []
        count = 0
        if province == 'ALL':
            print("Begin crawl passed weather")
            for city in self.get_cities():
                print(f"{city['province']} {city['city']} {city['code']}")
                data = self.parse_json(f'http://www.nmc.cn/f/rest/passed/{city["code"]}')
                if data:
                    count += 1
                    for item in data:
                        item['city_code'] = city['code']
                        item['province'] = city['province']
                        item['city_name'] = city['city']
                        item['city_index'] = str(count)
                    passed_weather.extend(data)
                time.sleep(1)
                if count % 50 == 0:
                    if count == 50:
                        self.write_header(weather_passed_file, passed_weather)
                    else:
                        self.write_row(weather_passed_file, passed_weather)
                    passed_weather = []
            if passed_weather:
                if count <= 50:
                    self.write_header(weather_passed_file, passed_weather)
                else:
                    self.write_row(weather_passed_file, passed_weather)
            print("End crawl passed weather")
        else:
            print("Begin crawl passed weather")
            select_city = [x for x in self.get_cities() if x['province'] == province]
            for city in select_city:
                print(f"{city['province']} {city['city']} {city['code']}")
                data = self.parse_json(f'http://www.nmc.cn/f/rest/passed/{city["code"]}')
                if data:
                    count += 1
                    for item in data:
                        item['city_index'] = str(count)
                        item['city_code'] = city['code']
                        item['province'] = city['province']
                        item['city_name'] = city['city']
                    passed_weather.extend(data)
            self.write_csv(weather_passed_file, passed_weather)
            print("End crawl passed weather")

    def run(self, range='ALL'):
        self.get_passed_weather(range)

# Uncomment to run
if __name__ == '__main__':
    crawler = Crawler()
    crawler.run('ALL')
