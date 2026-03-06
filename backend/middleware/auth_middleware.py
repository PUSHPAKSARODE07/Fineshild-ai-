from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from backend.config.settings import SECRET_KEY, ALGORITHM


# ===================================
# TOKEN SCHEME
# ===================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# ===================================
# TOKEN VERIFICATION
# ===================================

def verify_token(token: str):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")

        if username is None:
            raise Exception("Invalid token")

        return {
            "username": username
        }

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token validation failed"
        )


# ===================================
# FASTAPI DEPENDENCY
# ===================================

def get_current_user(
    token: str = Depends(oauth2_scheme)
):

    return verify_token(token)