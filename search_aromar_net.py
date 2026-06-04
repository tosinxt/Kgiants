import urllib.request
import urllib.parse
import re

queries = [
    "Oopsie Poopsie Berry Fresh",
    "Oopsie Poopsie Mediterranean Sage",
    "Oopsie Poopsie Jingle Smells",
    "Rocket Scent Cherry",
    "Rocket Scent Fresh Linens",
    "Floor Stand"
]

for q in queries:
    url = f"https://aromar.net/index.php?route=product/search&search={urllib.parse.quote(q)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        images = re.findall(r'src="(https://aromar\.net/image/cache/catalog/[^"]+)"', html)
        print(f"QUERY: {q}")
        print("IMAGES:", list(set(images))[:3])
    except Exception as e:
        print(f"Error for {q}: {e}")

