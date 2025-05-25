import os
import cv2
import matplotlib.pyplot as plt
from utils import generate_salt, hash_key_with_salt, validate_password_strength
from encryptor import encrypt_channel, decrypt_channel
from database import init_db, save_to_db, load_from_db
from config import MAX_IMAGE_DIM

def main():
    init_db()
    image_path = input("Enter image path: ").strip()
    filename = os.path.basename(image_path)

    record = load_from_db(filename)
    if record:
        encrypted_image, stored_hash, salt, meta = record
        if input("Encrypted image found. Decrypt? (y/n): ").lower() == 'y':
            key = input("Enter decryption key: ")
            hashed = hash_key_with_salt(key, salt)
            if hashed != stored_hash:
                print("Incorrect key!")
                return
            B, G, R = cv2.split(encrypted_image)
            R_dec = decrypt_channel(R, meta['R_order'], meta['R_perm'], hashed, meta['R_start'], meta['rows'], meta['cols'])
            G_dec = decrypt_channel(G, meta['G_order'], meta['G_perm'], hashed, meta['G_start'], meta['rows'], meta['cols'])
            B_dec = decrypt_channel(B, meta['B_order'], meta['B_perm'], hashed, meta['B_start'], meta['rows'], meta['cols'])
            dec_img = cv2.merge([B_dec, G_dec, R_dec])
            orig = cv2.imread(image_path)
            orig = cv2.resize(orig, (meta['cols'], meta['rows']))
            show_images(orig, encrypted_image, dec_img)
            return

    img = cv2.imread(image_path)
    if img is None:
        print("Invalid image path.")
        return

    h, w = img.shape[:2]
    if max(h, w) > MAX_IMAGE_DIM:
        scale = MAX_IMAGE_DIM / max(h, w)
        img = cv2.resize(img, (int(w * scale), int(h * scale)))

    B, G, R = cv2.split(img)

    while True:
        key = input("Enter strong encryption key: ")
        if validate_password_strength(key):
            break
        print("Weak password. Try again.")

    salt = generate_salt()
    hashed = hash_key_with_salt(key, salt)

    R_enc, R_ord, R_perm, R_start, rows, cols = encrypt_channel(R, hashed)
    G_enc, G_ord, G_perm, G_start, _, _ = encrypt_channel(G, hashed)
    B_enc, B_ord, B_perm, B_start, _, _ = encrypt_channel(B, hashed)

    encrypted = cv2.merge([B_enc, G_enc, R_enc])

    metadata = {
        'R_order': R_ord, 'R_perm': R_perm, 'R_start': R_start,
        'G_order': G_ord, 'G_perm': G_perm, 'G_start': G_start,
        'B_order': B_ord, 'B_perm': B_perm, 'B_start': B_start,
        'rows': rows, 'cols': cols
    }

    save_to_db(filename, encrypted, hashed, salt, metadata)
    print(f"Image '{filename}' encrypted and saved.")

def show_images(orig, encrypted, decrypted):
    plt.figure(figsize=(15, 5))
    for i, (title, img) in enumerate(zip(["Original", "Encrypted", "Decrypted"], [orig, encrypted, decrypted])):
        plt.subplot(1, 3, i + 1)
        plt.title(title)
        plt.axis('off')
        plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    main()
