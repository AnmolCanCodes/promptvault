from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


MAX_BCRYPT_PASSWORD_BYTES = 72


def _truncate_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    if len(password_bytes) <= MAX_BCRYPT_PASSWORD_BYTES:
        return password

    truncated_bytes = password_bytes[:MAX_BCRYPT_PASSWORD_BYTES]
    return truncated_bytes.decode("utf-8", errors="ignore")


def hash_password(password: str) -> str:
    return pwd_context.hash(_truncate_password(password))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(_truncate_password(plain_password), hashed_password)