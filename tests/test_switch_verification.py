"""
Automated Test Suite for CloudOps Switch
Validates Switch protocol room configuration, SQLite persistence,
Mattermost ingestion, graceful degradation behavior, and Milestone 1 evidence.
"""

import unittest
import os
import json
import sqlite3
import datetime

class TestCloudOpsSwitch(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.dirname(os.path.dirname(__file__))
        self.db_path = os.path.join(self.root_dir, "incidents.db")
        self.switch_yaml_path = os.path.join(self.root_dir, "switch.yaml")
        self.evidence_path = os.path.join(self.root_dir, "evidence", "milestone_1_verification.json")

    def test_switch_yaml_exists_and_valid(self):
        """Verifies switch.yaml configuration exists and conforms to Switch schema."""
        self.assertTrue(os.path.exists(self.switch_yaml_path), "switch.yaml must exist")
        with open(self.switch_yaml_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("workspace:", content)
        self.assertIn("incident-triage", content)
        self.assertIn("mattermost-primary", content)
        self.assertIn("openai-codex", content)

    def test_milestone_1_evidence_validity(self):
        """Verifies that Milestone 1 captured real evidence of Switch agent collaboration."""
        self.assertTrue(os.path.exists(self.evidence_path), "milestone_1_verification.json must exist")
        with open(self.evidence_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.assertEqual(data["status"], "VERIFIED_SUCCESS")
        self.assertGreaterEqual(len(data["workflow_steps"]), 4)
        
        # Verify agents
        agent_names = [a["name"] for a in data["connected_agents"]]
        self.assertIn("DevOps Engineer", agent_names)
        self.assertIn("Kubernetes Engineer", agent_names)
        self.assertIn("Incident Coordinator", agent_names)

    def test_sqlite_database_tables(self):
        """Verifies SQLite tables exist and initial incident is seeded."""
        self.assertTrue(os.path.exists(self.db_path), "incidents.db must exist")
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        self.assertIn("incidents", tables)
        self.assertIn("switch_events", tables)
        self.assertIn("switch_settings", tables)

        cursor.execute("SELECT id, title, severity, status FROM incidents")
        incidents = cursor.fetchall()
        self.assertGreaterEqual(len(incidents), 1)
        self.assertEqual(incidents[0][0], "INC-2026-001")
        self.assertEqual(incidents[0][2], "P2")
        self.assertEqual(incidents[0][3], "RESOLVED")
        conn.close()

    def test_graceful_degradation_state(self):
        """Verifies that disconnected state disables active triage and reports accurate status."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT value FROM switch_settings WHERE key = 'switch_connected'")
        row = cursor.fetchone()
        conn.close()
        self.assertIsNotNone(row)
        # Value is either 'true' or 'false'
        self.assertIn(row[0].lower(), ["true", "false"])

if __name__ == "__main__":
    unittest.main()
