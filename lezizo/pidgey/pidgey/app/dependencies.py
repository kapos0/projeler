from fastapi import HTTPException, status, Query

from settings import settings


def verify_access_code(apiKey: str = Query(None, description="API Key")):

    if apiKey != settings.API_KEY:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
