import re

def validate_regex(pattern, text):
    """Validate if text matches regex pattern"""
    try:
        compiled = re.compile(pattern)
        result = bool(compiled.search(text))
        return result, None
    except re.error as e:
        return False, str(e)

def filter_ip(pattern, ip_list):
    """Filter IP addresses using regex"""
    try:
        compiled = re.compile(pattern)
        matched = [ip for ip in ip_list if compiled.match(ip)]
        return matched, None
    except re.error as e:
        return [], str(e)
