import matplotlib.pyplot as plt
import networkx as nx

def visualize_mst(adj_matrix, rows, cols, title_prefix=""):
    """
    Draws the MST graph with labeled nodes and weighted edges.
    """
    G = nx.Graph()
    for u in range(len(adj_matrix)):
        for v, w in adj_matrix[u]:
            if not G.has_edge(u, v):  # Avoid duplicates
                G.add_edge(u, v, weight=w)

    pos = {i * cols + j: (j, -i) for i in range(rows) for j in range(cols)}

    plt.figure(figsize=(8, 8), constrained_layout=True)
    nx.draw(G, pos,
            node_size=500, node_color='lightblue', font_size=10,
            edge_color='gray', with_labels=True)
    
    weights = nx.get_edge_attributes(G, 'weight')
    nx.draw_networkx_edge_labels(G, pos, edge_labels=weights, font_color='black')

    plt.title(f"{title_prefix} - Minimum Spanning Tree", fontsize=16, color='darkblue')
    plt.axis('off')
    plt.show()


def visualize_dfs_on_mst(adj_matrix, dfs_order, rows, cols, title_prefix=""):
    """
    Animates the DFS traversal over the MST.
    """
    G = nx.Graph()
    for u in range(len(adj_matrix)):
        for v, w in adj_matrix[u]:
            if not G.has_edge(u, v):
                G.add_edge(u, v, weight=w)

    pos = {i * cols + j: (j, -i) for i in range(rows) for j in range(cols)}
    visited_edges = []
    visited_nodes = set()

    plt.ion()
    fig, ax = plt.subplots(figsize=(10, 10), constrained_layout=True)

    for i in range(len(dfs_order) - 1):
        ax.clear()
        current_node = dfs_order[i]
        next_node = dfs_order[i + 1]

        visited_nodes.add(current_node)
        visited_edges.append((current_node, next_node))

        # Draw MST structure
        nx.draw(G, pos, ax=ax,
                node_size=300, node_color='lightgray',
                edge_color='lightgray', with_labels=True, font_size=8)

        # Highlight visited nodes
        nx.draw_networkx_nodes(G, pos, ax=ax, nodelist=list(visited_nodes),
                               node_color='limegreen', node_size=350)

        # Highlight current node
        nx.draw_networkx_nodes(G, pos, ax=ax, nodelist=[next_node],
                               node_color='crimson', node_size=400)

        # DFS directed edges
        dfs_graph = nx.DiGraph()
        dfs_graph.add_edges_from(visited_edges)
        nx.draw_networkx_edges(dfs_graph, pos, ax=ax,
                               edge_color='orange', width=3,
                               arrows=True, arrowstyle='-|>', arrowsize=20)

        ax.set_title(f"{title_prefix} - DFS Step {i + 1}/{len(dfs_order) - 1}",
                     fontsize=14, color='navy')
        ax.axis('off')
        plt.pause(0.6)

    plt.pause(1.5)  # Hold final frame for a moment
    plt.ioff()
    plt.show()
