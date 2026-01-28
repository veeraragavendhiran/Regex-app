from . import db
from datetime import datetime

class RegexTest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pattern = db.Column(db.String(200), nullable=False)
    test_string = db.Column(db.String(200), nullable=False)
    matched = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "pattern": self.pattern,
            "test_string": self.test_string,
            "matched": self.matched,
            "created_at": self.created_at.isoformat()
        }
