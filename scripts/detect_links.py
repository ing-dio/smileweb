import sqlite3
import requests

db_path = '/path/to/your/database.db'

def check_url_status(url):
    try:
        response = requests.head(url, allow_redirects=True, timeout=5)
        return response.status_code == 200
    except requests.RequestException:
        return False

def main():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT id, url FROM sdb")
    rows = cursor.fetchall()

    for row in rows:
        id, url = row
        if not check_url_status(url):
            print(f"URL with ID {id} is not accessible: {url}")
            cursor.execute("DELETE FROM sdb WHERE id = ?", (id,))
            conn.commit()

    conn.close()

if __name__ == "__main__":
    main()
