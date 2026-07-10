"""Seed the database with sample categories and products."""

from django.core.management.base import BaseCommand
from products.models import Category, Product

CATEGORIES = [
    {
        'name': 'Phone Cases',
        'description': 'Premium protective cases for all phone models.',
        'icon': 'Smartphone',
        'image_url': 'https://placehold.co/600x400/4f46e5/white?text=Phone+Cases',
    },
    {
        'name': 'Chargers',
        'description': 'Fast chargers and charging stations.',
        'icon': 'Zap',
        'image_url': 'https://placehold.co/600x400/2563eb/white?text=Chargers',
    },
    {
        'name': 'Screen Protectors',
        'description': 'Tempered glass and film screen protectors.',
        'icon': 'Shield',
        'image_url': 'https://placehold.co/600x400/0891b2/white?text=Screen+Protectors',
    },
    {
        'name': 'Earphones',
        'description': 'Wireless and wired earphones for every budget.',
        'icon': 'Headphones',
        'image_url': 'https://placehold.co/600x400/7c3aed/white?text=Earphones',
    },
    {
        'name': 'Power Banks',
        'description': 'Portable power banks to keep you charged on the go.',
        'icon': 'BatteryCharging',
        'image_url': 'https://placehold.co/600x400/059669/white?text=Power+Banks',
    },
    {
        'name': 'Cables',
        'description': 'Durable charging and data transfer cables.',
        'icon': 'Cable',
        'image_url': 'https://placehold.co/600x400/d97706/white?text=Cables',
    },
]

PRODUCTS = [
    # Phone Cases
    {'name': 'Premium Silicone Case - Black', 'category': 'Phone Cases', 'price': '24.99',
     'discount_price': '19.99', 'rating': '4.5', 'num_reviews': 128, 'stock': 150, 'featured': True,
     'description': 'Soft-touch silicone case with precise cutouts. Compatible with iPhone 14/15 series. Wireless charging compatible.'},
    {'name': 'Clear Shockproof Case', 'category': 'Phone Cases', 'price': '18.99',
     'rating': '4.3', 'num_reviews': 89, 'stock': 200, 'featured': False,
     'description': 'Crystal clear case with military-grade drop protection. Anti-yellowing TPU material.'},
    {'name': 'Leather Wallet Case - Brown', 'category': 'Phone Cases', 'price': '34.99',
     'discount_price': '27.99', 'rating': '4.7', 'num_reviews': 64, 'stock': 75, 'featured': True,
     'description': 'Genuine leather wallet case with 3 card slots. Magnetic closure. Fits iPhone 15 Pro Max.'},
    # Chargers
    {'name': '65W GaN Fast Charger', 'category': 'Chargers', 'price': '49.99',
     'discount_price': '39.99', 'rating': '4.8', 'num_reviews': 256, 'stock': 100, 'featured': True,
     'description': 'Ultra-compact 65W GaN charger with USB-C PD. Charges laptops, phones, and tablets. Includes 2 USB-C ports.'},
    {'name': '15W Wireless Charging Pad', 'category': 'Chargers', 'price': '29.99',
     'rating': '4.2', 'num_reviews': 112, 'stock': 180, 'featured': False,
     'description': 'Qi-certified wireless charging pad. LED indicator. Compatible with all Qi-enabled devices.'},
    {'name': '3-in-1 Wireless Charging Station', 'category': 'Chargers', 'price': '69.99',
     'discount_price': '54.99', 'rating': '4.6', 'num_reviews': 78, 'stock': 60, 'featured': True,
     'description': 'Charge your phone, watch, and earbuds simultaneously. Foldable design for travel.'},
    # Screen Protectors
    {'name': '9H Tempered Glass Screen Protector', 'category': 'Screen Protectors', 'price': '12.99',
     'rating': '4.4', 'num_reviews': 340, 'stock': 500, 'featured': False,
     'description': 'Ultra-clear 9H tempered glass. Oleophobic coating. Easy bubble-free installation kit included.'},
    {'name': 'Privacy Screen Protector', 'category': 'Screen Protectors', 'price': '16.99',
     'discount_price': '12.99', 'rating': '4.1', 'num_reviews': 145, 'stock': 300, 'featured': False,
     'description': 'Anti-spy privacy glass. Keeps your screen private from side angles. Full adhesive coverage.'},
    {'name': 'Anti-Glare Matte Screen Protector', 'category': 'Screen Protectors', 'price': '14.99',
     'rating': '4.3', 'num_reviews': 92, 'stock': 250, 'featured': False,
     'description': 'Matte finish reduces glare and fingerprints. Smooth writing surface for stylus users.'},
    # Earphones
    {'name': 'Wireless Earbuds Pro', 'category': 'Earphones', 'price': '89.99',
     'discount_price': '69.99', 'rating': '4.7', 'num_reviews': 520, 'stock': 120, 'featured': True,
     'description': 'Active noise cancellation. Transparency mode. Up to 30 hours battery with charging case. IPX4 water resistant.'},
    {'name': 'Sport Earbuds - IPX7', 'category': 'Earphones', 'price': '39.99',
     'rating': '4.4', 'num_reviews': 210, 'stock': 150, 'featured': False,
     'description': 'Sweatproof and waterproof earbuds for workouts. Secure hook design. 8 hours playtime per charge.'},
    {'name': 'Wired Earphones with Mic', 'category': 'Earphones', 'price': '14.99',
     'discount_price': '9.99', 'rating': '4.0', 'num_reviews': 380, 'stock': 600, 'featured': False,
     'description': 'High-quality wired earphones with in-line microphone and volume control. 3.5mm jack.'},
    # Power Banks
    {'name': '20000mAh Power Bank PD 30W', 'category': 'Power Banks', 'price': '59.99',
     'discount_price': '44.99', 'rating': '4.6', 'num_reviews': 175, 'stock': 90, 'featured': True,
     'description': 'High-capacity 20000mAh power bank with 30W USB-C PD fast charging. Can charge laptops. Digital display.'},
    {'name': '10000mAh Slim Power Bank', 'category': 'Power Banks', 'price': '29.99',
     'rating': '4.3', 'num_reviews': 230, 'stock': 200, 'featured': False,
     'description': 'Ultra-slim design. 18W fast charging. Dual USB-A output. LED battery indicator.'},
    {'name': 'MagSafe Power Bank 5000mAh', 'category': 'Power Banks', 'price': '39.99',
     'discount_price': '31.99', 'rating': '4.5', 'num_reviews': 88, 'stock': 110, 'featured': True,
     'description': 'Magnetic wireless power bank for MagSafe-compatible phones. Snaps on the back. Compact and portable.'},
    # Cables
    {'name': 'Braided USB-C to USB-C Cable 2m', 'category': 'Cables', 'price': '16.99',
     'rating': '4.5', 'num_reviews': 410, 'stock': 400, 'featured': False,
     'description': 'Nylon braided USB-C cable. Supports up to 100W power delivery and 480Mbps data transfer. 2 meter length.'},
    {'name': 'Lightning to USB Cable 1m', 'category': 'Cables', 'price': '12.99',
     'discount_price': '8.99', 'rating': '4.2', 'num_reviews': 320, 'stock': 500, 'featured': False,
     'description': 'MFi-certified Lightning cable. Durable PVC jacket. 1 meter length. Fast charging supported.'},
    {'name': 'USB-C to Lightning Cable 1.5m', 'category': 'Cables', 'price': '19.99',
     'rating': '4.6', 'num_reviews': 156, 'stock': 250, 'featured': True,
     'description': 'MFi-certified USB-C to Lightning cable. Supports 20W fast charging for iPhone. 1.5 meter length.'},
]


class Command(BaseCommand):
    help = 'Seed the database with sample categories and products'

    def handle(self, *args, **options):
        # Clear existing data
        Product.objects.all().delete()
        Category.objects.all().delete()

        self.stdout.write(self.style.WARNING('Creating categories...'))

        category_map = {}
        for cat_data in CATEGORIES:
            cat = Category.objects.create(**cat_data)
            category_map[cat.name] = cat
            self.stdout.write(f'  ✓ Created category: {cat.name}')

        self.stdout.write(self.style.WARNING('Creating products...'))

        for prod_data in PRODUCTS:
            cat_name = prod_data.pop('category')
            featured = prod_data.pop('featured')
            cat = category_map[cat_name]

            Product.objects.create(
                category=cat,
                is_featured=featured,
                image_url=f"https://placehold.co/600x600/{self._color_for_category(cat_name)}/white?text={prod_data['name'][:20].replace(' ', '+')}",
                **prod_data
            )
            self.stdout.write(f'  ✓ Created product: {prod_data["name"]}')

        self.stdout.write(self.style.SUCCESS(
            f'\n✓ Seeded {len(CATEGORIES)} categories and {len(PRODUCTS)} products successfully!'
        ))

    @staticmethod
    def _color_for_category(name):
        colors = {
            'Phone Cases': '4f46e5',
            'Chargers': '2563eb',
            'Screen Protectors': '0891b2',
            'Earphones': '7c3aed',
            'Power Banks': '059669',
            'Cables': 'd97706',
        }
        return colors.get(name, '475569')