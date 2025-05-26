def image_to_edges(channel):
    rows, cols = channel.shape
    edges = []
    for i in range(rows):
        for j in range(cols):
            idx = i * cols + j
            if j + 1 < cols:
                right_idx = i * cols + (j + 1)
                edges.append((idx, right_idx, abs(int(channel[i, j]) - int(channel[i, j + 1]))))
            if i + 1 < rows:
                down_idx = (i + 1) * cols + j
                edges.append((idx, down_idx, abs(int(channel[i, j]) - int(channel[i + 1, j]))))
    return edges, rows, cols

def find(parent, node):
    while parent[node] != node:
        parent[node] = parent[parent[node]]
        node = parent[node]
    return node

def union(parent, rank, x, y):
    xroot = find(parent, x)
    yroot = find(parent, y)
    if xroot == yroot:
        return
    if rank[xroot] < rank[yroot]:
        parent[xroot] = yroot
    else:
        parent[yroot] = xroot
        if rank[xroot] == rank[yroot]:
            rank[xroot] += 1

def kruskal_mst(channel):
    edges, rows, cols = image_to_edges(channel)
    edges.sort(key=lambda e: e[2])  # Sort by weight
    parent = {i: i for i in range(rows * cols)}
    rank = {i: 0 for i in range(rows * cols)}
    mst_adj = {i: [] for i in range(rows * cols)}
    
    for u, v, w in edges:
        if find(parent, u) != find(parent, v):
            union(parent, rank, u, v)
            mst_adj[u].append((v, w))  # Store with weight
            mst_adj[v].append((u, w))  # Store both directions

    return mst_adj, rows, cols


def dfs_order(mst_adj, start_node, size):
    visited, stack, order = set(), [start_node], []

    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            order.append(node)
            for nbr, _ in reversed(mst_adj[node]):  # Unpack the neighbor and weight
                if nbr not in visited:
                    stack.append(nbr)

    for node in range(size):
        if node not in visited:
            order.append(node)

    return order
