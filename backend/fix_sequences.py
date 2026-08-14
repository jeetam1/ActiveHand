import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.db import connection

def reset_sequences():
    if connection.vendor != 'postgresql':
        print(f"Database vendor is {connection.vendor}, skipping PostgreSQL sequence reset.")
        return

    tables = [
        'api_product',
        'api_order',
        'api_orderitem',
        'api_cartitem',
        'api_wishlistitem',
        'api_address',
        'api_userprofile',
        'auth_user',
    ]

    with connection.cursor() as cursor:
        for table in tables:
            try:
                sql = f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), COALESCE(max(id), 1)) FROM {table};"
                cursor.execute(sql)
                val = cursor.fetchone()[0]
                print(f"Table {table}: sequence set to {val}")
            except Exception as e:
                print(f"Error resetting {table}: {e}")

    print("\nAll database sequences synchronized successfully!")

if __name__ == '__main__':
    reset_sequences()
