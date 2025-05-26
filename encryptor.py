import numpy as np
import random
from graph_utils import kruskal_mst, dfs_order
from utils import get_seed_from_hash
from visualize import visualize_mst, visualize_dfs_on_mst


def encrypt_channel(channel, hashed_key, visualize=False, title_prefix="", partial_visualize=False):
    if partial_visualize:
        # Select a small 10x10 patch from top-left corner
        channel_patch = channel[:10, :10]
        mst_adj, rows, cols = kruskal_mst(channel_patch)
    else:
        mst_adj, rows, cols = kruskal_mst(channel)

    size = rows * cols
    seed = get_seed_from_hash(hashed_key)
    random.seed(seed)
    np.random.seed(seed)
    start_node = random.randint(0, size - 1)
    order = dfs_order(mst_adj, start_node, size)

    if visualize:
        visualize_mst(mst_adj, rows, cols, title_prefix)
        visualize_dfs_on_mst(mst_adj, order, rows, cols, title_prefix)

    # If partial visualized, return early (not encrypting whole image)
    if partial_visualize:
        return None, None, None, None, None, None

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
