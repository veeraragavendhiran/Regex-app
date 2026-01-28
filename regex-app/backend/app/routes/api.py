from flask import Blueprint, request, jsonify
import re
from ..models import RegexCheck
from .. import db

bp = Blueprint("api", __name__, url_prefix="/api")

@bp.route("/check", methods=["POST"])
def check_regex():
    data = request.get_json()
    pattern = data.get("pattern")
    test_string = data.get("test_string")

    try:
        matched = bool(re.match(pattern, test_string))
    except re.error as e:
        return jsonify({"error": f"Invalid regex: {str(e)}"}), 400

    # Save result in DB
    check = RegexCheck(pattern=pattern, test_string=test_string, matched=matched)
    db.session.add(check)
    db.session.commit()

    return jsonify(check.to_dict())

@bp.route("/history", methods=["GET"])
def get_history():
    checks = RegexCheck.query.order_by(RegexCheck.created_at.desc()).limit(10).all()
    return jsonify([c.to_dict() for c in checks])
