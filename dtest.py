# hierarchical_history_mindmap.py
import networkx as nx
import matplotlib.pyplot as plt

# -----------------------------
# 1️⃣ Nodes and Edges (Hierarchical: Chapter -> Topics -> Subtopics)
# -----------------------------
nodes = [
    "Theme 1: Bricks, Beads and Bones",
    "Harappan Civilization",
    "Early Settlements",
    "Trade and Crafts",
    "Religion and Rituals",
    "Material Culture",
    "Burial Practices",
    "Social Organization",
    "Artifacts",
    "Decline of Civilization"
]

edges = [
    ("Theme 1: Bricks, Beads and Bones", "Harappan Civilization"),
    ("Harappan Civilization", "Early Settlements"),
    ("Harappan Civilization", "Trade and Crafts"),
    ("Harappan Civilization", "Religion and Rituals"),
    ("Harappan Civilization", "Material Culture"),
    ("Material Culture", "Artifacts"),
    ("Religion and Rituals", "Burial Practices"),
    ("Harappan Civilization", "Social Organization"),
    ("Harappan Civilization", "Decline of Civilization")
]

# -----------------------------
# 2️⃣ Create Directed Graph
# -----------------------------
G = nx.DiGraph()
G.add_nodes_from(nodes)
G.add_edges_from(edges)

# -----------------------------
# 3️⃣ Hierarchical Layout (Top-down tree)
# -----------------------------
def hierarchy_pos(G, root=None, width=1., vert_gap=0.2, vert_loc=0, xcenter=0.5):
    '''
    If there is a cycle, it will not work correctly.
    root: the root node of the hierarchy
    width: horizontal space allocated
    vert_gap: gap between levels
    vert_loc: vertical location of root
    xcenter: horizontal location of root
    '''
    if not nx.is_tree(G):
        raise TypeError("G must be a tree")
    
    if root is None:
        root = list(G.nodes)[0]

    def _hierarchy_pos(G, node, left, right, vert_loc, pos):
        pos[node] = ((left + right) / 2, vert_loc)
        children = list(G.successors(node))
        if len(children) != 0:
            dx = (right - left) / len(children)
            nextx = left
            for child in children:
                pos = _hierarchy_pos(G, child, nextx, nextx+dx, vert_loc-vert_gap, pos)
                nextx += dx
        return pos

    return _hierarchy_pos(G, root, 0, width, vert_loc, {})

pos = hierarchy_pos(G, root="Theme 1: Bricks, Beads and Bones")

# -----------------------------
# 4️⃣ Draw Tree
# -----------------------------
plt.figure(figsize=(12,8))
nx.draw(
    G, 
    pos=pos, 
    with_labels=True, 
    node_color="lightblue", 
    node_size=3500, 
    arrows=True, 
    arrowsize=20,
    font_size=10,
    font_weight="bold"
)
plt.title("Class 12 History NCERT: Theme 1 Mind Map (Hierarchical)", fontsize=16)
plt.savefig("history_theme1_tree.png", dpi=300)
plt.show()