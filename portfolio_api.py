import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from livereload import Server
import webbrowser

# Load environment variables
load_dotenv()
GITHUB_USERNAME = os.getenv("GITHUB_USERNAME")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
BLACKLISTED_REPOS = ["SyntaxSkater"]
REPO_NAME = "portfolio"

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for API calls

# API endpoint to fetch environment variables
@app.route("/api/env", methods=["GET"])
def get_env_variables():
    return jsonify({"client_id": os.getenv("GOOGLE_CLIENT_ID")})

# Function to fetch GitHub repositories
def fetch_github_repos(username):
    url = f"https://api.github.com/users/{username}/repos"
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return [
            repo
            for repo in response.json()
            if repo["name"] not in BLACKLISTED_REPOS
        ]
    else:
        return []

# API endpoint to fetch GitHub repositories
@app.route("/api/repos", methods=["GET"])
def get_repos():
    repos = fetch_github_repos(GITHUB_USERNAME)
    return jsonify(repos)

# API endpoint to update blacklisted repos
@app.route("/api/blacklist", methods=["POST"])
def update_blacklist():
    global BLACKLISTED_REPOS
    data = request.json
    BLACKLISTED_REPOS = data.get("blacklisted_repos", BLACKLISTED_REPOS)
    return jsonify({"message": "Blacklist updated", "blacklisted_repos": BLACKLISTED_REPOS})

# Scheduler function to simulate periodic updates
@app.route("/api/sync", methods=["POST"])
def sync_repos():
    # Example of an update job
    print("Running portfolio sync...")
    repos = fetch_github_repos(GITHUB_USERNAME)
    print(f"Fetched {len(repos)} repositories.")
    return jsonify({"message": "Portfolio synchronization complete."})

# Function to run the Flask server with live reloading
if __name__ == "__main__":
    server = Server(app.wsgi_app)
    server.watch("templates/*")  # Watch HTML files
    server.watch("static/*")     # Watch CSS and JS files
    server.serve(port=5000, debug=True)
    # Automatically open the app in the default web browser
    webbrowser.open("http://127.0.0.1:5000")
    app.run(debug=True)
