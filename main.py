import numpy as np
import cv2
import networkx as nx
import random
import pickle
import matplotlib.pyplot as plt
from concurrent.futures import ThreadPoolExecutor
import os
import hashlib
import secrets
import re
import time
import psutil
from skimage.metrics import peak_signal_noise_ratio as psnr, structural_similarity as ssim
from collections import Counter
import math

# Generate a secure random salt
def generate_salt(length=16):
    return secrets.token_bytes(length)

# Hash the password with the salt using SHA-256
def hash_key_with_salt(key: str, salt: bytes) -> bytes:
    key_bytes = key.encode('utf-8')
    return hashlib.sha256(salt + key_bytes).digest()

# Convert hashed key bytes to a 32-bit seed integer
def get_seed_from_hashed_key(hashed_key: bytes):
    return int.from_bytes(hashed_key[:4], 'big')

# Validate password strength
def validate_password_strength(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters."
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter."
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter."
    if not re.search(r"\d", password):
        return False, "Password must contain at least one digit."
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character."
    return True, "Password is strong."

# Load and resize color image
def load_color_image(image_path, resize_dim=(256, 256)):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Error loading image. Check the path!")
    image = cv2.resize(image, resize_dim)
    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Convert image channel to graph
def image_to_graph(image_channel):
    rows, cols = image_channel.shape
    G = nx.Graph()
    for i in range(rows):
        for j in range(cols):
            if j + 1 < cols:
                G.add_edge((i, j), (i, j + 1),
                           weight=abs(int(image_channel[i, j]) - int(image_channel[i, j + 1])))
            if i + 1 < rows:
                G.add_edge((i, j), (i + 1, j),
                           weight=abs(int(image_channel[i, j]) - int(image_channel[i + 1, j])))
    return G

# Encrypt a channel using MST + DFS + key-based shuffle
def mst_scramble(image_channel, hashed_key, salt):
    G = image_to_graph(image_channel)
    mst = nx.minimum_spanning_tree(G)
    start_node = random.choice(list(mst.nodes))
    dfs_order = list(nx.dfs_preorder_nodes(mst, source=start_node))

    original_values = [image_channel[x, y] for x, y in dfs_order]

    seed = get_seed_from_hashed_key(hashed_key + salt)
    random.seed(seed)
    shuffled_values = original_values.copy()
    random.shuffle(shuffled_values)

    encrypted_channel = np.zeros_like(image_channel)
    for idx, (x, y) in enumerate(dfs_order):
        encrypted_channel[x, y] = shuffled_values[idx]

    return encrypted_channel, dfs_order, shuffled_values

# Decrypt channel using dfs_order and reshuffled values
def mst_unscramble(encrypted_channel, dfs_order, shuffled_values, hashed_key, salt):
    seed = get_seed_from_hashed_key(hashed_key + salt)
    random.seed(seed)
    indices = list(range(len(shuffled_values)))
    random.shuffle(indices)

    recovered_values = [0] * len(shuffled_values)
    for i, shuffled_idx in enumerate(indices):
        recovered_values[shuffled_idx] = shuffled_values[i]

    decrypted_channel = np.zeros_like(encrypted_channel)
    for idx, (x, y) in enumerate(dfs_order):
        decrypted_channel[x, y] = recovered_values[idx]

    return decrypted_channel

# Save image
def save_image(image, filename):
    cv2.imwrite(filename, cv2.cvtColor(image, cv2.COLOR_RGB2BGR))
    print(f"Image saved as {filename}")

# Display images
def display_images(original, encrypted, decrypted):
    plt.figure(figsize=(12, 4))
    titles = ["Original", "Encrypted", "Decrypted"]
    images = [original, encrypted, decrypted]
    for i in range(3):
        plt.subplot(1, 3, i + 1)
        plt.imshow(images[i])
        plt.title(titles[i])
        plt.axis("off")
    plt.tight_layout()
    plt.show()

# Save DFS orders, shuffled values, and salt
def save_encryption_data(filename, data):
    with open(filename, "wb") as f:
        pickle.dump(data, f)
    print(f"Encryption data saved to {filename}")

# Load data
def load_encryption_data(filename):
    with open(filename, "rb") as f:
        return pickle.load(f)

# Compare image difference
def validate_decryption(original, decrypted):
    diff = np.mean((original.astype("float") - decrypted.astype("float")) ** 2)
    if diff < 1.0:
        print("Decryption successful: Key is correct.")
    else:
        print("Decryption failed: Incorrect key or corrupted data.")

# Compute and print memory usage
def get_memory_usage():
    process = psutil.Process(os.getpid())
    mem_bytes = process.memory_info().rss
    mem_mb = mem_bytes / (1024 ** 2)
    return mem_mb

# Compare image quality
def compare_image_quality(img1, img2, label=""):
    psnr_val = psnr(img1, img2, data_range=255)
    ssim_val = ssim(img1, img2, channel_axis=2)
    print(f"Quality Comparison {label} → PSNR: {psnr_val:.2f}, SSIM: {ssim_val:.4f}")

#calculating entropy for encrypted image
def calculate_entropy(image_channel):
    histogram = Counter(image_channel.flatten())
    total_pixels = image_channel.size
    entropy = -sum((count / total_pixels) * math.log2(count / total_pixels) for count in histogram.values())
    return entropy

#calculating correlation
def calculate_correlation(original_channel, encrypted_channel):
    original = original_channel.flatten().astype(np.float64)
    encrypted = encrypted_channel.flatten().astype(np.float64)
    correlation = np.corrcoef(original, encrypted)[0, 1]
    return correlation

#calculating npcr
def calculate_npcr(img1, img2):
    diff = img1 != img2
    npcr = np.sum(diff) / diff.size * 100
    return npcr

#calculating uaci
def calculate_uaci(img1, img2):
    uaci = np.mean(np.abs(img1.astype(np.float64) - img2.astype(np.float64)) / 255.0) * 100
    return uaci

# ==== Main ====
if __name__ == "__main__":
    image_path = input("Enter path to the image: ").strip()
    if not os.path.exists(image_path):
        raise FileNotFoundError("Image file not found.")

    original_image = load_color_image(image_path)
    R, G, B = cv2.split(original_image)

    while True:
        key = input("Enter encryption key (min 8 chars, uppercase, lowercase, digit, special char): ").strip()
        valid, message = validate_password_strength(key)
        if valid:
            break
        print(f"{message} Please try again.")

    print("\nEncrypting...")
    salt = generate_salt()
    hashed_key = hash_key_with_salt(key, salt)

    start_encrypt = time.time()
    mem_before_encrypt = get_memory_usage()

    with ThreadPoolExecutor() as executor:
        R_result = executor.submit(mst_scramble, R, hashed_key, salt)
        G_result = executor.submit(mst_scramble, G, hashed_key, salt)
        B_result = executor.submit(mst_scramble, B, hashed_key, salt)

        R_encrypted, R_order, R_shuffled = R_result.result()
        G_encrypted, G_order, G_shuffled = G_result.result()
        B_encrypted, B_order, B_shuffled = B_result.result()

    mem_after_encrypt = get_memory_usage()
    end_encrypt = time.time()
    encrypt_time = end_encrypt - start_encrypt

    encrypted_image = cv2.merge([R_encrypted, G_encrypted, B_encrypted])
    save_image(encrypted_image, "encrypted_image.png")

    # Individual channel metrics
    channels = ["R", "G", "B"]
    original_channels = [R, G, B]
    encrypted_channels = [R_encrypted, G_encrypted, B_encrypted]

    for i in range(3):
        channel_name = channels[i]
        orig = original_channels[i]
        enc = encrypted_channels[i]
    
        entropy = calculate_entropy(enc)
        correlation = calculate_correlation(orig, enc)
        print(f"\n{channel_name}-Channel Metrics:")
        print(f"  Entropy: {entropy:.4f}")
        print(f"  Correlation Coefficient: {correlation:.4f}")

    # NPCR & UACI on full image
    npcr_value = calculate_npcr(original_image, encrypted_image)
    uaci_value = calculate_uaci(original_image, encrypted_image)
    print(f"\nImage Security Metrics:")
    print(f"   NPCR: {npcr_value:.2f}%")
    print(f"   UACI: {uaci_value:.2f}%")


    save_encryption_data("encryption_data.pkl",
                         (R_order, R_shuffled, G_order, G_shuffled, B_order, B_shuffled, salt))

    compare_image_quality(original_image, encrypted_image, label="(Original vs Encrypted)")

    print("\nDecrypting...")
    key2 = input("Enter decryption key: ").strip()

    R_order, R_shuffled, G_order, G_shuffled, B_order, B_shuffled, saved_salt = load_encryption_data("encryption_data.pkl")
    hashed_key2 = hash_key_with_salt(key2, saved_salt)

    start_decrypt = time.time()
    mem_before_decrypt = get_memory_usage()

    R_decrypted = mst_unscramble(R_encrypted, R_order, R_shuffled, hashed_key2, saved_salt)
    G_decrypted = mst_unscramble(G_encrypted, G_order, G_shuffled, hashed_key2, saved_salt)
    B_decrypted = mst_unscramble(B_encrypted, B_order, B_shuffled, hashed_key2, saved_salt)

    mem_after_decrypt = get_memory_usage()
    end_decrypt = time.time()
    decrypt_time = end_decrypt - start_decrypt

    decrypted_image = cv2.merge([R_decrypted, G_decrypted, B_decrypted])
    save_image(decrypted_image, "decrypted_image.png")

    validate_decryption(original_image, decrypted_image)
    compare_image_quality(original_image, decrypted_image, label="(Original vs Decrypted)")

    display_images(original_image, encrypted_image, decrypted_image)

    print(f"\nEncryption Time: {encrypt_time:.2f} seconds")
    print(f"Memory Used During Encryption: {mem_after_encrypt - mem_before_encrypt:.2f} MB")

    print(f"\nDecryption Time: {decrypt_time:.2f} seconds")
    print(f"Memory Used During Decryption: {mem_after_decrypt - mem_before_decrypt:.2f} MB")
    print("\nSecure Color Image Encryption & Decryption Completed!")