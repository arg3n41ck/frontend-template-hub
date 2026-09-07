"""Adapter boundary tests; no dependency installation or remote model calls."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'kit/graphify-build.py'


class GraphifyAdapterTest(unittest.TestCase):
    def invoke(self, root, *args):
        return subprocess.run([sys.executable, str(SCRIPT), '--project', str(root), *args],
                              capture_output=True, text=True)

    def test_rejects_external_source(self):
        with tempfile.TemporaryDirectory() as root:
            result = self.invoke(root, '--source', '..')
            self.assertNotEqual(result.returncode, 0)
            self.assertFalse((Path(root) / 'graphify-out').exists())

    @unittest.skipIf(os.name == 'nt', 'Symlink creation may need Windows privileges')
    def test_rejects_output_link(self):
        with tempfile.TemporaryDirectory() as root, tempfile.TemporaryDirectory() as outside:
            (Path(root) / 'src').mkdir()
            (Path(root) / 'graphify-out').symlink_to(outside, target_is_directory=True)
            result = self.invoke(root, '--source', 'src')
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(list(Path(outside).iterdir()), [])

    @unittest.skipUnless(importlib.util.find_spec('graphify'), 'Optional graphifyy runtime not installed')
    def test_local_graph(self):
        with tempfile.TemporaryDirectory() as root:
            src = Path(root) / 'src'
            src.mkdir()
            (src / 'example.py').write_text('def answer():\n    return 42\n')
            result = self.invoke(root, '--source', 'src')
            self.assertEqual(result.returncode, 0, result.stderr)
            graph = json.loads((Path(root) / 'graphify-out/graph.json').read_text())
            self.assertTrue(graph['nodes'])
            self.assertEqual(json.loads((Path(root) / 'graphify-out/scope.json').read_text())['mode'], 'code-only')


if __name__ == '__main__':
    unittest.main()
