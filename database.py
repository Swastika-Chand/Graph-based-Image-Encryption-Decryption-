import sqlite3, pickle, cv2
from datetime import datetime
import numpy as np
from config import DB_NAME

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS encrypted_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT UNIQUE,
            image_blob BLOB,
            hash_key BLOB,
            salt BLOB,
            metadata BLOB,
            timestamp TEXT
        )
    ''')
    conn.commit()
    conn.close()

def save_to_db(filename, image, hash_key, salt, metadata):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    _, buffer = cv2.imencode('.png', image)
    metadata_blob = pickle.dumps(metadata)
    timestamp = datetime.now().isoformat()
    c.execute("SELECT id FROM encrypted_images WHERE filename=?", (filename,))
    if c.fetchone():
        c.execute('''UPDATE encrypted_images SET image_blob=?, hash_key=?, salt=?, metadata=?, timestamp=? WHERE filename=?''',
                  (buffer.tobytes(), hash_key, salt, metadata_blob, timestamp, filename))
    else:
        c.execute('''INSERT INTO encrypted_images (filename, image_blob, hash_key, salt, metadata, timestamp)
                     VALUES (?, ?, ?, ?, ?, ?)''',
                  (filename, buffer.tobytes(), hash_key, salt, metadata_blob, timestamp))
    conn.commit()
    conn.close()

def load_from_db(filename):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT image_blob, hash_key, salt, metadata FROM encrypted_images WHERE filename=?", (filename,))
    row = c.fetchone()
    conn.close()
    if row:
        img_blob, key, salt, meta_blob = row
        metadata = pickle.loads(meta_blob)
        img_array = np.frombuffer(img_blob, np.uint8)
        image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        return image, key, salt, metadata
    return None
