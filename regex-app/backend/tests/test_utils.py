import unittest
from app.utils import validate_with_regex

class TestRegexUtils(unittest.TestCase):
    def test_email_validation(self):
        result = validate_with_regex(r"^[\w\.-]+@[\w\.-]+\.\w+$", "invalid-email")
        self.assertEqual(result["count"], 0)   # No matches expected

        result = validate_with_regex(r"^[\w\.-]+@[\w\.-]+\.\w+$", "test@example.com")
        self.assertGreater(result["count"], 0)  # At least 1 match

    def test_url_validation(self):
        result = validate_with_regex(r"^https?://[^\s/$.?#].[^\s]*$", "not_a_url")
        self.assertEqual(result["count"], 0)

        result = validate_with_regex(r"^https?://[^\s/$.?#].[^\s]*$", "https://example.com")
        self.assertGreater(result["count"], 0)

