#!/usr/bin/env python3
"""Build a local code-only Graphify graph; never install packages or use a model API."""
import argparse
import importlib.metadata
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--project', default='.')
    parser.add_argument('--source', action='append', required=True,
                        help='Relative code folder; repeat for multiple owned folders.')
    args = parser.parse_args()
    root = Path(args.project).resolve()
    if not root.is_dir():
        parser.error('Project must be an existing directory.')
    output = root / 'graphify-out'
    if output.is_symlink() or (output.exists() and not output.is_dir()):
        parser.error('Refusing an unsafe graph output path.')
    if output.exists() and any(p.is_symlink() for p in output.rglob('*')):
        parser.error('Refusing symlinks inside the graph output/cache.')
    scopes = []
    for raw in args.source:
        candidate = (root / raw).resolve()
        rel = candidate.relative_to(root)
        if not rel.parts or any(p.startswith('.') or p in {'node_modules', 'dist', 'build', 'graphify-out'} for p in rel.parts):
            parser.error('Choose a scoped application code folder inside the project.')
        if not candidate.is_dir():
            parser.error(f'Missing code directory: {raw}')
        scopes.append(candidate)
    if importlib.metadata.version('graphifyy') != '0.9.55':
        parser.error('This adapter is verified with graphifyy==0.9.55. See docs/GRAPHIFY.md.')
    from graphify.extract import collect_files, extract
    from graphify.build import build
    import networkx as nx
    files = sorted({p for scope in scopes for p in collect_files(scope, root=root, follow_symlinks=False)})
    if not files:
        parser.error('No supported code files in the selected scopes.')
    # Explicit local extraction/build: no semantic backend, daemon, hooks or model call.
    extraction = extract(files, cache_root=root, root=root, parallel=False)
    graph = build([extraction], directed=True, dedup=False, root=root)
    if not graph.number_of_nodes():
        raise RuntimeError('Extraction produced no nodes; do not report a successful graph.')
    output.mkdir(exist_ok=True)
    data = nx.node_link_data(graph, edges='links')
    (output / 'graph.json').write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')
    (output / 'scope.json').write_text(json.dumps({'version': '0.9.55', 'mode': 'code-only',
        'sources': [str(p.relative_to(root)) for p in scopes], 'files': len(files)}, indent=2), encoding='utf-8')
    print(json.dumps({'files': len(files), 'nodes': graph.number_of_nodes(),
                      'edges': graph.number_of_edges(), 'output': 'graphify-out/graph.json'}))


if __name__ == '__main__':
    main()
