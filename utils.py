import secrets
import hashlib
import re

def generate_salt(length=16):
    return secrets.token_bytes(length)

def hash_key_with_salt(key: str, salt: bytes) -> bytes:
    key_bytes = key.encode('utf-8')
    return hashlib.sha256(salt + key_bytes).digest()

def get_seed_from_hash(hashed_key: bytes) -> int:
    return int.from_bytes(hashed_key[:4], 'big')

def validate_password_strength(password):
    return (
        len(password) >= 8 and
        re.search(r"[A-Z]", password) and
        re.search(r"[a-z]", password) and
        re.search(r"\d", password) and
        re.search(r"[!@#$%^&*(),.?\":{}|<>]", password)
    )
