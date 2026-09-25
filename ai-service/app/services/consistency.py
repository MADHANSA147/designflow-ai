from typing import Dict, Any, List

def check_consistency(screen_tree: Dict[str, Any], design_system: Dict[str, Any], components: List[Dict[str, Any]]) -> List[str]:
    """
    Recursively validates a generated UI screen against the established Design System.
    Returns a list of consistency warnings/errors.
    """
    warnings = []
    
    # We recursively traverse the generated UI schema
    def traverse(node: Dict[str, Any]):
        node_type = node.get("type", "")
        styles = node.get("styles", {})
        
        # Check explicit radius violations
        radius = styles.get("borderRadius")
        if radius:
            # Example heuristic check
            ds_radius = design_system.get("radius", {}).get("button", "12px")
            if node_type == "Button" and radius != ds_radius:
                warnings.append(f"CONSISTENCY WARNING: Node {node.get('id', 'unknown')} (Button) uses radius {radius}. Design system requires {ds_radius}.")
                
        # Check explicit spacing/padding violations
        padding = styles.get("padding")
        if padding and padding not in design_system.get("spacing", []):
            warnings.append(f"CONSISTENCY WARNING: Node {node.get('id')} uses padding {padding} which is not in the design system spacing tokens.")
            
        # Check component reuse
        if node_type == "Custom" and "name" in node:
            # Did they hallucinate a component?
            known_components = [c.get("name") for c in components]
            if node["name"] not in known_components:
                warnings.append(f"CONSISTENCY WARNING: Node uses hallucinated component '{node['name']}'. Please use one of: {known_components}")
                
        for child in node.get("children", []):
            traverse(child)

    # Start traversal from root
    traverse(screen_tree)
    
    return warnings
