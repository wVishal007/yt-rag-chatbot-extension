# backend/services/diagram_service.py
import json
import logging
from io import BytesIO
import matplotlib.pyplot as plt
import networkx as nx

class DiagramService:
    """
    Generate hierarchical diagrams from transcript or text using an LLM,
    rendered with matplotlib + networkx (no Graphviz needed)
    """

    def __init__(self, generator):
        self.generator = generator

    def generate_diagram_instructions(self, text: str) -> str:
        """
        Ask LLM to generate a diagram JSON from text.
        """
        prompt = f"""
You are an expert educator.

Convert the following text into a hierarchical tree diagram. Respond **strictly in JSON only**, no explanations, no extra text.

Text:
{text}

Format:
{{
  "nodes": ["Node1", "Node2", ...],
  "edges": [["ParentNode", "ChildNode"], ...]
}}
"""
        response = self.generator.llm.invoke(prompt)
        logging.info(f"LLM Diagram Response: {response.content[:500]}")
        return response.content

    def diagram_from_instructions(self, instructions_json: str) -> bytes:
        """
        Convert JSON instructions to PNG bytes using matplotlib + networkx.
        """
        try:
            # Extract JSON
            instructions_json = instructions_json.strip()
            start = instructions_json.find("{")
            end = instructions_json.rfind("}")
            if start == -1 or end == -1:
                raise ValueError("No JSON object found in LLM output")
            json_str = instructions_json[start:end+1]

            data = json.loads(json_str)
            nodes = data.get("nodes", [])
            edges = data.get("edges", [])

            # Create graph
            G = nx.DiGraph()
            G.add_nodes_from(nodes)
            G.add_edges_from(edges)

            # Use hierarchical layout
            def hierarchy_pos(G, root=None, width=1., vert_gap=0.2, vert_loc=0, xcenter=0.5):
                """
                If there is a cycle, returns positions anyway.
                """
                if root is None:
                    root = next(iter(nx.topological_sort(G)))
                pos = {root: (xcenter, vert_loc)}
                children = list(G.successors(root))
                if len(children) != 0:
                    dx = width / len(children)
                    nextx = xcenter - width/2 - dx/2
                    for child in children:
                        nextx += dx
                        pos.update(hierarchy_pos(G, root=child, width=dx, vert_gap=vert_gap, vert_loc=vert_loc-vert_gap, xcenter=nextx))
                return pos

            pos = hierarchy_pos(G)

            # Draw the graph
            plt.figure(figsize=(12,8))
            nx.draw(G, pos, with_labels=True, arrows=True,
                    node_size=3000, node_color="skyblue",
                    font_size=12, font_weight="bold", alpha=0.9)
            plt.title("Hierarchical Diagram", fontsize=16)

            # Save to bytes
            buf = BytesIO()
            plt.savefig(buf, format="png", bbox_inches="tight", dpi=300)
            plt.close()
            buf.seek(0)
            return buf.getvalue()

        except Exception as e:
            logging.error(f"Failed to generate diagram: {e}")
            raise Exception(f"Diagram generation error: {e}")

    def generate_diagram(self, text: str) -> bytes:
        instructions = self.generate_diagram_instructions(text)
        return self.diagram_from_instructions(instructions)