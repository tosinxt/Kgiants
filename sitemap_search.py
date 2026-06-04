import urllib.request
import xml.etree.ElementTree as ET

sitemap_url = 'https://aromar.com/sitemap_products_1.xml'
req = urllib.request.Request(sitemap_url, headers={'User-Agent': 'Mozilla/5.0'})
xml_data = urllib.request.urlopen(req).read()

root = ET.fromstring(xml_data)

# Names to search for
targets = [
    "oopsie poopsie", "rocket scent", "floor stand", "display"
]

results = []
ns = {'ns0': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'image': 'http://www.google.com/schemas/sitemap-image/1.1'}

for url in root.findall('ns0:url', ns):
    loc = url.find('ns0:loc', ns).text
    # Get image
    img_element = url.find('image:image/image:loc', ns)
    img_loc = img_element.text if img_element is not None else None
    
    # Check if target in URL
    if any(t.replace(' ', '-') in loc.lower() or t.replace(' ', '') in loc.lower() for t in targets):
        results.append({"url": loc, "image": img_loc})

print(f"Found {len(results)} matches.")
for r in results:
    print(f"{r['url']} -> {r['image']}")
