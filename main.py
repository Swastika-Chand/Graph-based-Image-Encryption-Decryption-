import os
import cv2
import matplotlib.pyplot as plt
from utils import generate_salt, hash_key_with_salt, validate_password_strength
from encryptor import encrypt_channel, decrypt_channel
from database import init_db, save_to_db, load_from_db
from config import MAX_IMAGE_DIM
from datetime import datetime

def show_images(images, titles):
    plt.figure(figsize=(15, 5))
    for i, (img, title) in enumerate(zip(images, titles)):
        plt.subplot(1, len(images), i + 1)
        plt.title(title)
        plt.axis('off')
        plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    plt.tight_layout()
    plt.show()

def main():
    init_db()
    print("Choose operation:\n1. Encrypt an image\n2. Decrypt an image")
    choice = input("Enter 1 or 2: ").strip()

    if choice == '1':
        # --- ENCRYPTION ---
        image_path = input("Enter image path to encrypt: ").strip()
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
            key = input("Enter a strong encryption password: ").strip()
            if validate_password_strength(key):
                break
            print("Weak password. Try again.")

        salt = generate_salt()
        hashed = hash_key_with_salt(key, salt)

        # Encrypt each channel (visualization removed)
        R_enc, R_ord, R_perm, R_start, rows, cols = encrypt_channel(R, hashed)
        G_enc, G_ord, G_perm, G_start, _, _ = encrypt_channel(G, hashed)
        B_enc, B_ord, B_perm, B_start, _, _ = encrypt_channel(B, hashed)

        encrypted_img = cv2.merge([B_enc, G_enc, R_enc])
        filename = "encrypted_" + os.path.basename(image_path)

        metadata = {
            'R_order': R_ord, 'R_perm': R_perm, 'R_start': R_start,
            'G_order': G_ord, 'G_perm': G_perm, 'G_start': G_start,
            'B_order': B_ord, 'B_perm': B_perm, 'B_start': B_start,
            'rows': rows, 'cols': cols
        }

        save_to_db(filename, encrypted_img, hashed, salt, metadata)

        # Ask user to save encrypted image
        if input("Do you want to save the encrypted image to disk? (y/n): ").strip().lower() == 'y':
            out_dir = "encrypted_outputs"
            os.makedirs(out_dir, exist_ok=True)
            save_path = os.path.join(out_dir, filename)
            cv2.imwrite(save_path, encrypted_img)
            print(f"Encrypted image saved to: {save_path}")

        if input("View encrypted image? (y/n): ").strip().lower() == 'y':
            show_images([encrypted_img], ["Encrypted Image"])

    elif choice == '2':
        # --- DECRYPTION ---
        filename = os.path.basename(input("Enter encrypted image filename (no path): ").strip())
        record = load_from_db(filename)
        if not record:
            print("Encrypted image not found in database.")
            return

        encrypted_img, stored_hash, salt, meta = record
        key = input("Enter decryption password: ").strip()
        hashed = hash_key_with_salt(key, salt)
        if hashed != stored_hash:
            print("Incorrect password.")
            return

        B, G, R = cv2.split(encrypted_img)
        R_dec = decrypt_channel(R, meta['R_order'], meta['R_perm'], hashed, meta['R_start'], meta['rows'], meta['cols'])
        G_dec = decrypt_channel(G, meta['G_order'], meta['G_perm'], hashed, meta['G_start'], meta['rows'], meta['cols'])
        B_dec = decrypt_channel(B, meta['B_order'], meta['B_perm'], hashed, meta['B_start'], meta['rows'], meta['cols'])

        decrypted_img = cv2.merge([B_dec, G_dec, R_dec])
        print("Decryption completed successfully.")

        if input("View decrypted image? (y/n): ").strip().lower() == 'y':
            show_images([decrypted_img], ["Decrypted Image"])

        if input("Do you want to save the decrypted image to disk? (y/n): ").strip().lower() == 'y':
            out_dir = "decrypted_outputs"
            os.makedirs(out_dir, exist_ok=True)
            out_path = os.path.join(out_dir, "decrypted_" + filename)
            cv2.imwrite(out_path, decrypted_img)
            print(f"Decrypted image saved to: {out_path}")

    else:
        print("Invalid choice. Exiting.")

if __name__ == "__main__":
    main()
