from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import google.generativeai as genai
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure the Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load mock feedback data
def load_feedback_data():
    with open('feedback_data.json', 'r') as file:
        return json.load(file)

@app.route('/api/feedback', methods=['GET'])
def get_feedback():
    try:
        data = load_feedback_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze-feedback', methods=['POST'])
def analyze_feedback():
    try:
        # Get date range from request if provided
        request_data = request.get_json()
        start_date = request_data.get('startDate')
        end_date = request_data.get('endDate')
        
        # Load feedback data
        all_feedback = load_feedback_data()
        
        # Filter by date if applicable
        feedback_to_analyze = all_feedback
        if start_date and end_date:
            # Convert string dates to datetime for comparison
            start_date_obj = datetime.strptime(start_date, "%Y-%m-%d")
            end_date_obj = datetime.strptime(end_date, "%Y-%m-%d")
            
            feedback_to_analyze = [
                item for item in all_feedback 
                if start_date_obj <= datetime.strptime(item['Date'], "%Y-%m-%d") <= end_date_obj
            ]
        
        # Basic statistics calculation
        total_count = len(feedback_to_analyze)
        
        # Calculate average rating if available
        avg_rating = None
        if feedback_to_analyze and 'Rating' in feedback_to_analyze[0]:
            ratings = [item['Rating'] for item in feedback_to_analyze if 'Rating' in item]
            avg_rating = sum(ratings) / len(ratings) if ratings else None
        
        # Check if we have feedback to analyze
        if total_count == 0:
            return jsonify({
                "error": "No feedback found for the selected date range"
            }), 400
        
        # Prepare feedback texts for LLM analysis
        feedback_texts = [item['FeedbackText'] for item in feedback_to_analyze]
        
        # Generate prompt for Gemini
        prompt = f"""
        I have {total_count} customer feedback entries to analyze. 
        
        Here's a sample of the feedback:
        {feedback_texts[:min(10, len(feedback_texts))]}
        
        Please provide a concise summary that includes:
        1. Overall sentiment (positive, neutral, negative)
        2. Common themes or topics mentioned
        3. Key issues or pain points identified
        4. Notable positive aspects mentioned
        5. Recommendations based on the feedback
        
        Format the summary in a clear, professional tone suitable for business stakeholders.
        """
        
        # Check if API key is configured
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return jsonify({
                "error": "Gemini API key not configured. Please check your .env file."
            }), 500
        
        # Call Gemini API with error handling
        try:
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)
            summary_text = response.text
        except Exception as gemini_error:
            print(f"Gemini API error: {str(gemini_error)}")
            # If AI summary fails, provide a basic summary
            summary_text = ("Unable to generate AI summary due to an API issue. "
                           f"Basic statistics: Analyzed {total_count} feedback entries " 
                           f"with an average rating of {avg_rating:.1f}/5 if available.")
        
        # Return the results
        result = {
            "totalFeedback": total_count,
            "averageRating": avg_rating,
            "summary": summary_text,
            "sampleFeedback": feedback_to_analyze[:min(5, len(feedback_to_analyze))]  # Include a sample of the analyzed feedback
        }
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error in analyze_feedback: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)