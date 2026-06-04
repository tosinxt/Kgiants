import urllib.request
import urllib.parse
import json
import re

queries = [
    "Oopsie Poopsie Berry Fresh",
    "Oopsie Poopsie Mediterranean Sage",
    "Oopsie Poopsie Jingle Smells",
    "Oopsie Poopsie Star Bliss",
    "Rocket Scent Cherry",
    "Rocket Scent Cherry Almond",
    "Rocket Scent Fresh Linens",
    "Rocket Scent Tropical Mango",
    "Aromar Plus Floor Stand",
    "Display 4X4 Oopsie"
]

results = {}

for q in queries:
    url = f"https://aromar.com/search?type=product&q={urllib.parse.quote(q)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        # Find images in the search results
        # Shopify typically has cdn.shopify.com/...
        images = set(re.findall(r'https://cdn\.shopify\.com/s/files/[^"\'\s]+(?:\.jpg|\.png|\.webp)', html))
        results[q] = list(images)[:3]
    except Exception as e:
        results[q] = str(e)

print(json.dumps(results, indent=2))
