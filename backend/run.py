from dotenv import load_dotenv

from app.app import create_app
from app.ma import ma

load_dotenv(".env")  # need to be here
if __name__ == "__main__":
    # mail = Mail(app)
    app = create_app()
    ma.init_app(app)
    app.run(host='0.0.0.0', port=8080, threaded=True, debug=True)
