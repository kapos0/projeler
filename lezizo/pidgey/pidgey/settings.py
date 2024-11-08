from os import getenv, path

from dotenv import load_dotenv


class Settings:
    # Load Environment Variables
    BASEDIR = path.abspath(path.dirname(__file__))
    load_dotenv(path.join(BASEDIR, ".env"))

    # Base Settings
    SECRET_KEY = getenv("SECRET_KEY", "MercanBirSahildeymisGemilerBulmakKasvetliGunlereKaldi")
    DEVELOPER_MODE = getenv("DEVELOPER_MODE", True)

    # API Settings
    API_VERSION = getenv("API_VERSION", "1.0.0")
    API_NAME = getenv("API_NAME", "Recipes API")
    API_URL = getenv("API_URL", "http://0.0.0.0:8000/")
    API_TIMEZONE = getenv("API_TIMEZONE", "Europe/Istanbul")
    API_KEY = getenv("API_KEY", "27935ae5c63a4ddcb4115d88da86adcc")

    # MySQL Database Settings
    MYSQL_SERVER_NAME = getenv("MYSQL_SERVER_NAME", "localhost")
    MYSQL_SERVER_PORT = getenv("MYSQL_SERVER_PORT", 3306)
    MYSQL_USER_NAME = getenv("MYSQL_USER_NAME", "root")
    MYSQL_USER_PASSWORD = getenv("MYSQL_USER_PASSWORD", "")
    MYSQL_DATABASE_NAME = getenv("MYSQL_DATABASE_NAME", "pidgey")

    # SQLAlchemy Settings
    SQLALCHEMY_DATABASE_URI = getenv(
        "SQLALCHEMY_DATABASE_URI",
        "mysql+pymysql://{user_name}:{user_password}@{server_name}:{server_port}/{database_name}".format(
            user_name=MYSQL_USER_NAME,
            user_password=MYSQL_USER_PASSWORD,
            server_name=MYSQL_SERVER_NAME,
            server_port=MYSQL_SERVER_PORT,
            database_name=MYSQL_DATABASE_NAME,
        ),
    )

    # Author Settings
    AUTHOR_NAME = "Mehmet Enes Turhan"
    AUTHOR_URL = "https://www.google.com.tr"
    AUTHOR_EMAIL = "eden.turhann@gmail.com"


settings = Settings()
