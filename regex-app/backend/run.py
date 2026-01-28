from flask import Flask, request, jsonify
import re
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS   # 👈 Added

app = Flask(__name__)
CORS(app)  # 👈 Enable CORS

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///regex.db'
db = SQLAlchemy(app)

class RegexCheck(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pattern = db.Column(db.String(200), nullable=False)
    test_string = db.Column(db.String(200), nullable=False)
    matched = db.Column(db.Boolean, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

# ✅ Homepage route
@app.route("/", methods=["GET"])
def home():
    return "✅ Regex API is running! Use POST /api/check"

# ✅ Regex check route
@app.route("/api/check", methods=["POST"])
def check_regex():
    # Debugging logs
    print("📩 Raw request data:", request.data)
    print("📩 Request headers:", dict(request.headers))

    try:
        data = request.get_json(force=True)
        print("✅ Parsed JSON:", data)
    except Exception as e:
        print("❌ JSON parse error:", e)
        return jsonify({"error": "Invalid JSON"}), 400

    if not data:
        return jsonify({"error": "No JSON received"}), 400

    pattern = data.get("pattern")
    test_string = data.get("test_string")

    if not pattern or not test_string:
        return jsonify({"error": "pattern and test_string are required"}), 400

    try:
        matched = bool(re.match(pattern, test_string))

        # Save result
        record = RegexCheck(pattern=pattern, test_string=test_string, matched=matched)
        db.session.add(record)
        db.session.commit()

        return jsonify({
            "pattern": pattern,
            "test_string": test_string,
            "matched": matched
        })
    except re.error as e:
        return jsonify({"error": str(e)}), 400


# ✅ History route
@app.route("/api/history", methods=["GET"])
def get_history():
    records = RegexCheck.query.order_by(RegexCheck.timestamp.desc()).limit(10).all()
    return jsonify([
        {
            "id": r.id,
            "pattern": r.pattern,
            "test_string": r.test_string,
            "matched": r.matched,
            "timestamp": r.timestamp.isoformat()
        } for r in records
    ])

if __name__ == "__main__":
    print(app.url_map)
    app.run(debug=True, port=5000)  # 👈 Ensure port 5000
