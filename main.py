import os
import cv2
import matplotlib.pyplot as plt
from utils import generate_salt, hash_key_with_salt, validate_password_strength
from encryptor import encrypt_channel, decrypt_channel
from database import init_db, save_to_db, load_from_db
from performance_metrics import (
    calculate_entropy, calculate_correlation,
    calculate_npcr, calculate_uaci, calculate_psnr,
    track_encryption_time, track_decryption_time
)
from config import MAX_IMAGE_DIM

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

        if input("Do you want to visualize DFS traversal on a patch? (y/n): ").strip().lower() == 'y':
            channel_choice = input("Choose color channel to visualize (R/G/B): ").strip().upper()
            if channel_choice not in ['R', 'G', 'B']:
                print("Invalid channel. Skipping visualization.")
            else:
                try:
                    patch_rows = int(input("Enter patch height (e.g., 10): "))
                    patch_cols = int(input("Enter patch width (e.g., 10): "))
                    row_start = int(input("Enter starting row index (e.g., 0): "))
                    col_start = int(input("Enter starting column index (e.g., 0): "))

                    channel_map = {'R': R, 'G': G, 'B': B}
                    patch = channel_map[channel_choice][row_start:row_start+patch_rows, col_start:col_start+patch_cols]

                    if patch.shape[0] < patch_rows or patch.shape[1] < patch_cols:
                        print("Patch exceeds image boundary. Skipping visualization.")
                    else:
                        encrypt_channel(
                            patch,
                            hashed_key=hashed,
                            visualize=True,
                            title_prefix=f"{channel_choice} Channel DFS Patch",
                            partial_visualize=False
                        )
                except ValueError:
                    print("Invalid patch input. Skipping visualization.")

        # Encrypt each channel and track time
        (R_enc, R_ord, R_perm, R_start, rows, cols), enc_time_R = track_encryption_time(encrypt_channel, R, hashed)
        (G_enc, G_ord, G_perm, G_start, _, _), enc_time_G = track_encryption_time(encrypt_channel, G, hashed)
        (B_enc, B_ord, B_perm, B_start, _, _), enc_time_B = track_encryption_time(encrypt_channel, B, hashed)

        encrypted_img = cv2.merge([B_enc, G_enc, R_enc])
        encryption_time = enc_time_R + enc_time_G + enc_time_B

        filename = "encrypted_" + os.path.basename(image_path)

        metadata = {
            'R_order': R_ord, 'R_perm': R_perm, 'R_start': R_start,
            'G_order': G_ord, 'G_perm': G_perm, 'G_start': G_start,
            'B_order': B_ord, 'B_perm': B_perm, 'B_start': B_start,
            'rows': rows, 'cols': cols
        }

        save_to_db(filename, encrypted_img, hashed, salt, metadata)

        gray_enc = cv2.cvtColor(encrypted_img, cv2.COLOR_BGR2GRAY)
        gray_orig = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        print(f"\n--- Encrypted Image Metrics ---")
        print(f"Encryption Time Taken: {encryption_time:.4f} seconds")
        print(f"Entropy: {calculate_entropy(gray_enc):.4f}")
        corrs = calculate_correlation(gray_enc)
        print(f"Correlation Coefficients: H={corrs['horizontal']:.4f}, V={corrs['vertical']:.4f}, D={corrs['diagonal']:.4f}")
        print(f"NPCR: {calculate_npcr(gray_orig, gray_enc):.2f}%")
        print(f"UACI: {calculate_uaci(gray_orig, gray_enc):.2f}%")
        print(f"PSNR: {calculate_psnr(gray_orig, gray_enc):.2f} dB")

        if input("Save encrypted image to disk? (y/n): ").strip().lower() == 'y':
            os.makedirs("encrypted_outputs", exist_ok=True)
            save_path = os.path.join("encrypted_outputs", filename)
            cv2.imwrite(save_path, encrypted_img)
            print(f"Encrypted image saved at: {save_path}")

        if input("View encrypted image? (y/n): ").strip().lower() == 'y':
            show_images([encrypted_img], ["Encrypted Image"])

    elif choice == '2':
        filename = os.path.basename(input("Enter encrypted image filename: ").strip())
        record = load_from_db(filename)
        if not record:
            print("Image not found in database.")
            return

        encrypted_img, stored_hash, salt, meta = record
        key = input("Enter password: ").strip()
        hashed = hash_key_with_salt(key, salt)
        if hashed != stored_hash:
            print("Incorrect password.")
            return

        B, G, R = cv2.split(encrypted_img)

        (R_dec), dec_time_R = track_decryption_time(decrypt_channel, R, meta['R_order'], meta['R_perm'], hashed, meta['R_start'], meta['rows'], meta['cols'])
        (G_dec), dec_time_G = track_decryption_time(decrypt_channel, G, meta['G_order'], meta['G_perm'], hashed, meta['G_start'], meta['rows'], meta['cols'])
        (B_dec), dec_time_B = track_decryption_time(decrypt_channel, B, meta['B_order'], meta['B_perm'], hashed, meta['B_start'], meta['rows'], meta['cols'])

        decrypted_img = cv2.merge([B_dec, G_dec, R_dec])
        decryption_time = dec_time_R + dec_time_G + dec_time_B

        gray_decrypted = cv2.cvtColor(decrypted_img, cv2.COLOR_BGR2GRAY)
        gray_enc = cv2.cvtColor(encrypted_img, cv2.COLOR_BGR2GRAY)

        print(f"\n--- Decrypted Image Metrics ---")
        print(f"Decryption Time Taken: {decryption_time:.4f} seconds")
        print(f"Entropy: {calculate_entropy(gray_decrypted):.4f}")
        corrs = calculate_correlation(gray_decrypted)
        print(f"Correlation Coefficients: H={corrs['horizontal']:.4f}, V={corrs['vertical']:.4f}, D={corrs['diagonal']:.4f}")
        print(f"NPCR: {calculate_npcr(gray_enc, gray_decrypted):.2f}%")
        print(f"UACI: {calculate_uaci(gray_enc, gray_decrypted):.2f}%")
        print(f"PSNR: {calculate_psnr(gray_enc, gray_decrypted):.2f} dB")

        if input("View decrypted image? (y/n): ").strip().lower() == 'y':
            show_images([decrypted_img], ["Decrypted Image"])

        if input("Save decrypted image to disk? (y/n): ").strip().lower() == 'y':
            os.makedirs("decrypted_outputs", exist_ok=True)
            save_path = os.path.join("decrypted_outputs", "decrypted_" + filename)
            cv2.imwrite(save_path, decrypted_img)
            print(f"Decrypted image saved at: {save_path}")

    else:
        print("Invalid choice.")

if __name__ == "__main__":
    main()
