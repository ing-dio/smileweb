import sqlite3
import os

def read_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    return content

def split_content(content):
    return list(joke for joke in content.split('*') if joke.strip())

def write_to_db(db_path, elements):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE IF NOT EXISTS sdb (content TEXT)')
    cursor.execute('DELETE FROM sdb')  # Clear existing data
    for element in elements:
        cursor.execute('INSERT INTO sdb (content) VALUES (?)', (element,))
    conn.commit()
    conn.close()

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_file = base_dir+'/db/data.txt'
    output_db = base_dir+'/db/data.db'
    
    content = read_file(input_file)
    elements = split_content(content)
    write_to_db(output_db, elements)

if __name__ == "__main__":
    main()