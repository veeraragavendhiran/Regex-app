from .. import db
from datetime import datetime

class RegexEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pattern = db.Column(db.String(255), nullable=False)
    test_input = db.Column(db.String(255), nullable=False)
    matched = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
