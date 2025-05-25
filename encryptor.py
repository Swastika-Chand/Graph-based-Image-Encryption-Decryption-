import numpy as np
import random
from graph_utils import kruskal_mst, dfs_order
from utils import get_seed_from_hash

def encrypt_channel(channel, hashed_key):
    mst_adj, rows, cols = kruskal_mst(channel)
    size = rows * cols
    seed = get_seed_from_hash(hashed_key)
    random.seed(seed)
    np.random.seed(seed)
    start_node = random.randint(0, size - 1)
    order = dfs_order(mst_adj, start_node, size)
    flat = channel.flatten()
    values = flat[order]
    perm = np.random.permutation(len(values))
    shuffled = values[perm]
    encrypted = np.zeros(size, dtype=np.uint8)
    for idx, val in zip(order, shuffled):
        encrypted[idx] = val
    return encrypted.reshape(rows, cols), order, perm, start_node, rows, cols

def decrypt_channel(enc_channel, order, perm, hashed_key, start_node, rows, cols):
    size = rows * cols
    seed = get_seed_from_hash(hashed_key)
    random.seed(seed)
    np.random.seed(seed)
    inverse_perm = np.zeros_like(perm)
    inverse_perm[perm] = np.arange(len(perm))
    flat_enc = enc_channel.flatten()
    shuffled = np.array([flat_enc[i] for i in order])
    restored = shuffled[inverse_perm]
    decrypted = np.zeros(size, dtype=np.uint8)
    for idx, val in zip(order, restored):
        decrypted[idx] = val
    return decrypted.reshape(rows, cols)
