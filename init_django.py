aimport sys
import os

user_site = os.path.expanduser(r"~\AppData\Roaming\Python\Python314\site-packages")
if os.path.exists(user_site) and user_site not in sys.path:
    sys.path.insert(0, user_site)

import django
print(f"Django version: {django.get_version()}")

from django.core.management import execute_from_command_line

backend_dir = os.path.join(os.getcwd(), "backend")
os.chdir(backend_dir)

# Create django project 'server' inside backend directory if manage.py doesn't exist
if not os.path.exists(os.path.join(backend_dir, "manage.py")):
    execute_from_command_line(["django-admin", "startproject", "server", "."])
    print("Django project 'server' created.")

if not os.path.exists(os.path.join(backend_dir, "api")):
    execute_from_command_line(["manage.py", "startapp", "api"])
    print("Django app 'api' created.")
