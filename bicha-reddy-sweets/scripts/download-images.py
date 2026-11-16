#!/usr/bin/env python3
"""Optional: downloads the original product photos into images/products/.
Run once while online:   python3 scripts/download-images.py
The site works without it (it overwrites the placeholder images)."""
import os, urllib.request

PHOTOS = {
    'Sweets': 'photo-1599598425947-330026e6378e',
    'Dry Fruit kajju': 'photo-1599598425947-330026e6378e',
    'Bakery': 'photo-1596503924719-74d6c70ef011',
    'Chai Spot': 'photo-1578985545062-69928b1d9587',
    'Our Kitchen': 'photo-1555396273-367ea4eb4db5',
}
    'Chanda Nagar': 'photo-1555396273-367ea4eb4db5',
    'Kondapur': 'photo-1605197130282-53ea1a1ecde6',
    'Nallagandla': 'photo-1601314115160-c3d3a669cb23',
    'Kukatpally': 'photo-1626776876729-bab4369a5a5a',
}
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'images', 'products')
os.makedirs(out, exist_ok=True)
for name, pid in PHOTOS.items():
    url = f'https://images.unsplash.com/{pid}?q=80&w=1200&auto=format&fit=crop'
    dest = os.path.join(out, name + '.jpg')
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as r, open(dest, 'wb') as f:
            f.write(r.read())
        print('OK  ', name)
    except Exception as e:
        print('FAIL', name, e)
