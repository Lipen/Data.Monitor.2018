import os
import json
import websocket

url = 'wss://ut.kb.gov.spb.ru/wstele1/'
data = {}
filename = 'rawdata.csv'
filename_meta = 'cars_json'

with open(filename_meta) as f:
    meta = json.load(f)
    cars_data = {}
    for car in meta['result']:
        cars_data[car['did']] = car['job']


def on_message(ws, message):
    e = json.loads(message)
    block_number = e['BlockNumber']
    datetime = e['unit_time']
    lat = e['latitude']
    lon = e['longitude']
    speed = e['speed']
    mode = e['mode']
    mode_time = e['mode_time']
    sensors = e['sensors']
    sensors_mask = e['sensors_mask']
    route = e['route']
    adc0 = e['adc0']
    adc1 = e['adc1']
    adc2 = e['adc2']
    quality = e['quality']
    key_mask = e['key_mask']
    source = e['Source']
    number = e['Number']
    job = cars_data[block_number]
    if 58 <= lat <= 62 and 29 <= lon <= 32:
        # print(f'Block {bn}, number {num}, time = {time}, lat = {lat:.3f}, lon = {lon:.3f}, speed = {speed:.2f}')
        # print(f'{bn}, {time}, {lat}, {lon}, {speed}')
        with open(filename, 'a') as f:
            # f.write(f'{bn},{time},{lat},{lon},{speed}\n')
            f.write(f'{block_number},{job},{datetime},{lat},{lon},{speed},{mode},{mode_time},{sensors},{sensors_mask},{route},{adc0},{adc1},{adc2},{quality},{key_mask},{source},{number}\n')


def main():
    if os.path.exists(filename):
        print(f'Appending to <{filename}>')
    else:
        print('Creating new rawfile')
        os.makedirs(os.path.dirname(os.path.abspath(filename)), exist_ok=True)
        with open(filename, 'w') as f:
            f.write('block_number,job,datetime,lat,lon,speed,mode,mode_time,sensors,sensors_mask,route,adc0,adc1,adc2,quality,key_mask,source,number\n')

    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(url, on_message=on_message)

    ws.run_forever()


if __name__ == '__main__':
    main()
