from traceback import print_exc

from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException
from starlette.applications import Starlette
from starlette.routing import Mount
from fastapi.middleware.cors import CORSMiddleware

from app.endpoints import router
from settings import settings
from app.dependencies import verify_access_code

api = FastAPI(
    title=settings.API_NAME,
    version=settings.API_VERSION,
    contact={"name": settings.AUTHOR_NAME, "url": settings.AUTHOR_URL, "email": settings.AUTHOR_EMAIL},
)

origins = [
    "http://127.0.0.1",
    "https://127.0.0.1",
    "http://localhost",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:5173",
]

api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


api.include_router(router)
# api.include_router(router, dependencies=[Depends(verify_access_code)])


@api.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    if isinstance(exc.detail, str):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error_code": exc.status_code, "error_message": exc.detail},
        )
    elif isinstance(exc.detail, dict):
        return JSONResponse(
            status_code=exc.status_code,
            content=exc.detail,
        )

    return JSONResponse(
        status_code=exc.status_code, content={"error_code": exc.detail.value, "error_message": exc.detail.phrase}
    )


@api.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception:  
        if settings.DEVELOPER_MODE:
            print_exc()
        else:
            pass

        return JSONResponse(status_code=500, content={"error_code": 500, "error_message": "Internal Server Error"})


app = Starlette(routes=[Mount("/", api)])
