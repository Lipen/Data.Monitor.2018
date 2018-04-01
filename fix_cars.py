import json

filename_cars = 'data/cars_json'
filename_fixed = 'data/fixed_cars.json'

with open(filename_cars) as f:
    cars_data = json.load(f)['result']

cars_keys = 'vgn acn did nc eclassid imgType mn bn I_MASK I_AL M_MASK M_AL F1_ID F1_MASK F1_AL F2_ID F2_MASK F2_AL F3_ID F3_MASK F3_AL F4_ID F4_MASK F4_AL GB_MASK GB_AL I_KC job'.split()

fixed_data = [{k: item.get(k, None) for k in cars_keys} for item in cars_data]

with open(filename_fixed, 'w') as f:
    json.dump(fixed_data, f, ensure_ascii=False)
