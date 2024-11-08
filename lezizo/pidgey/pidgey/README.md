# Pidgey

Recipes app powered by FastAPI and MySQL.

## Requirements

The project is developed using Python and uses the MySQL database. You can find the system requirements below. The rest of the requirements (FastAPI, SQLAlchemy etc) are packaged in the project.

| Requirement | Version |
| ----------- | ------- |
| Python      | 3.10.12 |
| MySQL       | 8.3.0   |

The rest of the project requirements can be found in the `requirements.txt` file.

## Important Links

Python: https://www.python.org/downloads/
XAMPP (For MySQL): https://www.apachefriends.org/tr/index.html
Python Install On Windows: https://phoenixnap.com/kb/how-to-install-python-3-windows
Pip Install On Windows: https://phoenixnap.com/kb/install-pip-windows
Virtualenv Install On Windows: https://www.geeksforgeeks.org/creating-python-virtual-environment-windows-linux/

## Installation

Once Python and MySQL are installed on the system (and the virtualenv package if requested), the actual installation can be done.

**Note:** Before starting this procedure, refer to "Defining System Settings" in the next step.

For the installation process, Python packages containing the requirements of the project are first installed on the system and then the "Migrations" process is performed to create the database tables.

Please navigate via CMD to the folder where your project is located and enter the following commands. If you are going to use the `virtualenv` package, activate it.

**Note:** Please do not use `~$` when typing the following installation commands. This command refers to the command line.

```bash
~$  pip install requirements.txt
~$ alembic upgrade head
~$ uvicorn app:app
```

Once these commands have been processed successfully, you can access the API documentation by going to `http://127.0.0.1:8000/docs` in the browser.

The project is now ready to go!

## Defining System Settings

You may need to make some changes before running the project. For example, you may want to change the name of the project or you may be connecting to the MySQL database with a password. In this case, you can create the `.env` file in the project directory and enter various settings.

For example, the sample file for some of the most important settings is as follows.

```bash
MYSQL_DATABASE_NAME = "MySQLDatabaseName"
API_KEY = "TheAPIKey"
```

If you don't want to change the settings, you can continue to use the settings specified in `settings.py`. If you want to change a setting, it must be added to the `.env` file in a key-value relationship.
