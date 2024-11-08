# app/api/recommend/route.py
import pandas as pd
import json
from http.server import BaseHTTPRequestHandler

# Load the CSV file if it exists
try:
    data = pd.read_csv('/data/data.csv')
except FileNotFoundError:
    data = pd.DataFrame(columns=["Common Material", "Sustainable Substitute", "EISc(original)", "EIS (Substitute)"])

# Clean and preprocess the data
data.dropna(inplace=True)
data['Common Material'] = data['Common Material'].str.lower().str.strip()
data['Sustainable Substitute'] = data['Sustainable Substitute'].str.lower().str.strip()

# Define a function to provide recommendations
def recommend_substitute(material):
    material = material.lower().strip()
    substitute_row = data[data['Common Material'] == material]

    if not substitute_row.empty:
        original_score = substitute_row['EISc(original)'].values[0]
        substitute = substitute_row['Sustainable Substitute'].values[0]
        substitute_score = substitute_row['EIS (Substitute)'].values[0]

        return {
            'Material': material,
            'Original Score': original_score,
            'Substitute': substitute,
            'Substitute Score': substitute_score
        }
    else:
        return {"error": "No recommendation found for this material."}

# Define the request handler for Vercel
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse the material from the URL parameters
        material = self.path.split('?material=')[1] if '?material=' in self.path else None
        
        # Respond with the recommendation
        if material:
            result = recommend_substitute(material)
            response = json.dumps(result)
        else:
            response = json.dumps({"error": "Please provide a material to recommend a substitute for."})

        # Set response headers and send the data
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(response.encode('utf-8'))
