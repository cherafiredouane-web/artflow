#!/usr/bin/env python3
"""Dependency-free integrity checks for the generated Artflow static site."""
from pathlib import Path
import json, sys

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'


def load(rel):
    return json.loads((SITE / rel).read_text(encoding='utf-8'))


def main():
    catalog = load('data/catalog.json')
    categories = load('data/categories.json')
    config = load('data/store-config.json')
    errors = []

    ids = [p.get('id') for p in catalog]
    slugs = [p.get('slug') for p in catalog]
    titles = [p.get('titleFr', '').casefold() for p in catalog]
    if len(ids) != len(set(ids)): errors.append('Duplicate artwork IDs')
    if len(slugs) != len(set(slugs)): errors.append('Duplicate artwork slugs')
    if len(titles) != len(set(titles)): errors.append('Duplicate French titles')

    expected_category_ids = {'abstrait','art-islamique','culture-marocaine','meilleures-ventes','minimaliste-geometrique','nature-animaux'}
    category_ids = {c.get('id') for c in categories}
    if category_ids != expected_category_ids: errors.append('Category IDs do not match the six official categories')

    valid = set(ids)
    for p in catalog:
        if not p.get('titleFr') or not p.get('titleAr'): errors.append(f"Missing title translation: {p.get('id')}")
        if not p.get('categories') or not set(p['categories']).issubset(category_ids): errors.append(f"Invalid categories: {p.get('id')}")
        if p.get('dominantColor') not in {'Beige','Blanc','Noir','Gris','Marron','Bleu','Vert','Rouge','Orange','Jaune / doré','Rose','Violet','Multicolore'}:
            errors.append(f"Invalid dominant color: {p.get('id')}")
        img = SITE / p.get('image','').replace('./','',1)
        if not img.is_file(): errors.append(f"Missing artwork asset: {p.get('id')} -> {img}")

    expected_sizes = [('60 × 40 cm',230),('80 × 60 cm',280),('85 × 110 cm',342)]
    actual_sizes = [(x.get('label'),x.get('priceMAD')) for x in config.get('productSizeOptions',[])]
    if actual_sizes != expected_sizes: errors.append(f'Unexpected shared size/price configuration: {actual_sizes}')
    if config.get('whatsappNumber') != '212627025271': errors.append('Unexpected WhatsApp number')
    best = config.get('bestSellerArtworkIds',[])
    if len(best) != len(set(best)): errors.append('Duplicate bestseller IDs')
    if not set(best).issubset(valid): errors.append('Unknown ID in bestseller list')
    bestseller_category = 'meilleures-ventes'
    expected_best = {p['id'] for p in catalog if bestseller_category in p['categories']}
    if set(best) != expected_best: errors.append('Bestseller list does not exactly match owner-designated folder membership')

    category_totals = {c['id']: sum(c['id'] in p['categories'] for p in catalog) for c in categories}
    if errors:
        print('FAIL')
        for e in errors: print(' -', e)
        return 1
    print('PASS')
    print(f'Unique artworks: {len(catalog)}')
    print(f'Unique slugs: {len(slugs)}')
    print(f'Bestseller IDs: {len(best)}')
    print('Category counts:', ', '.join(f"{k}={v}" for k,v in category_totals.items()))
    print('Assets found:', sum((SITE / p['image'].replace('./','',1)).is_file() for p in catalog), '/', len(catalog))
    return 0

if __name__ == '__main__':
    sys.exit(main())
