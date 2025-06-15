import numpy as np
import cv2
import time

# 1. Entropy
def calculate_entropy(gray_img):
    hist = cv2.calcHist([gray_img], [0], None, [256], [0, 256])
    hist = hist.ravel() / hist.sum()
    hist = hist[hist > 0]
    return -np.sum(hist * np.log2(hist))


# 2. Correlation Coefficients (Horizontal, Vertical, Diagonal)
def calculate_correlation(gray_img):
    rows, cols = gray_img.shape
    gray_img = gray_img.astype(np.float64)

    x_h = gray_img[:, :-1].flatten()
    y_h = gray_img[:, 1:].flatten()
    corr_h = np.corrcoef(x_h, y_h)[0, 1]

    x_v = gray_img[:-1, :].flatten()
    y_v = gray_img[1:, :].flatten()
    corr_v = np.corrcoef(x_v, y_v)[0, 1]

    x_d = gray_img[:-1, :-1].flatten()
    y_d = gray_img[1:, 1:].flatten()
    corr_d = np.corrcoef(x_d, y_d)[0, 1]

    return {
        'horizontal': corr_h,
        'vertical': corr_v,
        'diagonal': corr_d
    }


# 3. NPCR (Number of Pixels Change Rate)
def calculate_npcr(img1, img2):
    if img1.shape != img2.shape:
        raise ValueError("Images must be of the same shape for NPCR")

    diff = np.not_equal(img1, img2)
    npcr = np.sum(diff) / diff.size * 100
    return npcr


# 4. UACI (Unified Average Changing Intensity)
def calculate_uaci(img1, img2):
    img1 = img1.astype(np.float64)
    img2 = img2.astype(np.float64)
    diff = np.abs(img1 - img2)
    uaci = np.mean(diff / 255.0) * 100
    return uaci


# 5. PSNR (Peak Signal-to-Noise Ratio)
def calculate_psnr(original, compared):
    mse = np.mean((original - compared) ** 2)
    if mse == 0:
        return float('inf')
    max_pixel = 255.0
    psnr = 20 * np.log10(max_pixel / np.sqrt(mse))
    return psnr


# 6. Time Measurement Utility Functions
def track_encryption_time(func, *args, **kwargs):
    start = time.time()
    result = func(*args, **kwargs)
    end = time.time()
    return result, end - start

def track_decryption_time(func, *args, **kwargs):
    start = time.time()
    result = func(*args, **kwargs)
    end = time.time()
    return result, end - start
