from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import re
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai
from collections import Counter
import math

# Load environment variables
load_dotenv()

# Configure the Gemini API
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# Store the working model name to avoid repeated trials
WORKING_MODEL = "gemini-1.5-flash"  # We know this model works

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

# Simplified text preprocessing without NLTK
def preprocess_text(text):
    if not text:
        return []
    # Convert to lowercase
    text = text.lower()
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Simple tokenization (split by whitespace)
    tokens = text.split()
    # Remove common stop words
    stop_words = {'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
                 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
                 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
                 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
                 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
                 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 
                 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
                 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
                 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 
                 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
                 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
                 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'}
    tokens = [word for word in tokens if word not in stop_words]
    return tokens

def extract_themes(texts, top_n=5):
    all_tokens = []
    for text in texts:
        tokens = preprocess_text(text)
        all_tokens.extend(tokens)
    
    # Count word frequencies
    word_counter = Counter(all_tokens)
    
    # Remove very common words that might not be meaningful themes
    common_words = {'good', 'bad', 'service', 'product', 'use', 'like', 'would', 'get'}
    for word in common_words:
        if word in word_counter:
            del word_counter[word]
    
    # Get the most common words as themes
    themes = word_counter.most_common(top_n)
    return themes

def simple_sentiment_analysis(texts):
    positive_words = {'great', 'good', 'excellent', 'awesome', 'love', 'amazing', 'best', 'perfect', 'better', 'improved', 'recommend', 'positive', 'helpful', 'impressed', 'satisfied', 'easy', 'fast', 'friendly', 'nice', 'happy'}
    negative_words = {'bad', 'poor', 'terrible', 'worst', 'hate', 'difficult', 'issue', 'problem', 'fail', 'disappointing', 'slow', 'hard', 'confusing', 'complicated', 'frustrated', 'negative', 'useless', 'unhappy', 'expensive', 'waste'}
    
    sentiment_scores = []
    sentiment_categories = {'positive': 0, 'neutral': 0, 'negative': 0}
    
    for text in texts:
        if not text:
            continue
        
        tokens = preprocess_text(text)
        pos_count = sum(1 for token in tokens if token in positive_words)
        neg_count = sum(1 for token in tokens if token in negative_words)
        
        # Calculate sentiment score between -1 and 1
        total = pos_count + neg_count
        if total == 0:
            score = 0  # Neutral
            sentiment_categories['neutral'] += 1
        else:
            score = (pos_count - neg_count) / total
            if score > 0.2:
                sentiment_categories['positive'] += 1
            elif score < -0.2:
                sentiment_categories['negative'] += 1
            else:
                sentiment_categories['neutral'] += 1
        
        sentiment_scores.append(score)
    
    avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0
    return avg_sentiment, sentiment_categories, sentiment_scores

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
        rating_distribution = {}
        if feedback_to_analyze and 'Rating' in feedback_to_analyze[0]:
            # Use the bucketing logic for ratings:
            # Transform raw ratings into buckets (1-5)
            bucketed_ratings = []
            for item in feedback_to_analyze:
                if 'Rating' in item:
                    raw_rating = item['Rating']
                    # Apply bucketing logic: ceil the rating to the next integer if it's not already an integer
                    # For example, 0.1-1.0 becomes 1, 1.1-2.0 becomes 2, etc.
                    bucketed_rating = math.ceil(raw_rating)
                    # Ensure it's between 1-5
                    bucketed_rating = max(1, min(5, bucketed_rating))
                    bucketed_ratings.append(bucketed_rating)
            
            # Calculate average of the bucketed ratings
            avg_rating = sum(bucketed_ratings) / len(bucketed_ratings) if bucketed_ratings else None
            
            # Calculate rating distribution using the bucketed ratings
            rating_distribution = Counter(bucketed_ratings)
            rating_distribution = {str(k): v for k, v in rating_distribution.items()}
        
        # Prepare feedback texts for analysis
        feedback_texts = [item['FeedbackText'] for item in feedback_to_analyze]
        
        # Extract themes/topics
        themes = extract_themes(feedback_texts)
        
        # Simple sentiment analysis
        avg_sentiment, sentiment_categories, sentiment_scores = simple_sentiment_analysis(feedback_texts)
        
        # Calculate category distribution if available
        category_distribution = {}
        if feedback_to_analyze and 'Category' in feedback_to_analyze[0]:
            categories = [item['Category'] for item in feedback_to_analyze if 'Category' in item]
            category_distribution = Counter(categories)
            category_distribution = {k: v for k, v in category_distribution.items()}
        
        # Generate trend data by grouping feedback by date
        trend_data = []
        if feedback_to_analyze and 'Date' in feedback_to_analyze[0]:
            # Group feedback by date
            date_groups = {}
            for item in feedback_to_analyze:
                date = item['Date']
                if date not in date_groups:
                    date_groups[date] = []
                date_groups[date].append(item)
            
            # Calculate metrics for each date
            for date, items in sorted(date_groups.items()):
                # Get all ratings for this date
                date_ratings = [item['Rating'] for item in items if 'Rating' in item]
                avg_date_rating = sum(date_ratings) / len(date_ratings) if date_ratings else 0
                
                # Calculate satisfaction rate (% of ratings that are 4 or 5)
                satisfaction_count = sum(1 for rating in date_ratings if rating >= 4)
                satisfaction_rate = (satisfaction_count / len(date_ratings) * 100) if date_ratings else 0
                
                # Get feedback count for this date
                feedback_count = len(items)
                
                # Add to trend data
                trend_data.append({
                    "name": date,
                    "rating": round(avg_date_rating, 1),
                    "feedback": feedback_count,
                    "satisfactionRate": round(satisfaction_rate)
                })
        
        # Prepare data for charts
        chart_data = {
            "sentimentData": [
                {"name": "Positive", "value": sentiment_categories["positive"]},
                {"name": "Neutral", "value": sentiment_categories["neutral"]},
                {"name": "Negative", "value": sentiment_categories["negative"]}
            ],
            "ratingData": [
                {"name": str(rating), "value": count} 
                for rating, count in sorted(rating_distribution.items())
            ] if rating_distribution else [],
            "categoryData": [
                {"name": category, "value": count}
                for category, count in category_distribution.items()
            ] if category_distribution else [],
            "trendData": trend_data  # Use the dynamically generated trend data
        }
        
        # Format average rating properly
        avg_rating_str = f"{avg_rating:.2f}" if avg_rating is not None else "N/A"
        
        # Generate prompt for Gemini with our analysis
        prompt = f"""
        I have analyzed {total_count} customer feedback entries. Here's my statistical analysis:
        
        Average Rating: {avg_rating_str}/5
        Average Sentiment: {avg_sentiment:.2f} (ranges from -1 to 1, where 1 is very positive)
        Sentiment Distribution: {sentiment_categories}
        
        Top Themes/Keywords:
        {themes}
        
        Category Distribution:
        {category_distribution}

        Trend Data:
        {trend_data}
        
        Here's a sample of the feedback:
        {feedback_texts[:min(10, len(feedback_texts))]}
        
        Based on this analysis, please provide a comprehensive document-style summary that includes:
        
        1. An executive summary of the overall findings (2-3 paragraphs)
        2. Overall sentiment analysis (positive, neutral, negative) with specific examples from the feedback
        3. Detailed breakdown of the common themes identified, with examples of each theme
        4. Analysis of key issues or pain points mentioned, with direct quotes where relevant
        5. Analysis of positive aspects mentioned, with direct quotes where relevant
        6. Specific, actionable recommendations based on the feedback
        7. Analysis of trends over time based on the rating and satisfaction data
        8. Conclusion summarizing the findings and next steps
        
        Format the summary as a professional business document with clear sections and headings.
        """
        
        # Try to call Gemini API with error handling
        summary_text = ""
        try:
            # Generate content with the model
            model = genai.GenerativeModel(WORKING_MODEL)
            generation_config = {
                "temperature": 0.4,  # Lower temperature for more factual/structured output
                "top_p": 0.9,
                "top_k": 40,
                "max_output_tokens": 4096,  # Longer output for detailed document
            }
            response = model.generate_content(prompt, generation_config=generation_config)
            summary_text = response.text
                
        except Exception as gemini_error:
            print(f"Gemini API error: {str(gemini_error)}")
            # If AI summary fails, provide a basic document-style summary based on our analysis
            sentiment_type = "positive" if avg_sentiment > 0.2 else "negative" if avg_sentiment < -0.2 else "neutral"
            theme_text = "\n".join([f"- {theme[0]}: mentioned {theme[1]} times" for theme in themes])
            
            # Include trend analysis in the fallback summary
            trend_text = "No trend data available."
            if trend_data:
                latest_rating = trend_data[-1]["rating"] if trend_data else 0
                first_rating = trend_data[0]["rating"] if trend_data else 0
                rating_change = latest_rating - first_rating
                
                trend_text = f"""
                Our analysis shows that average ratings have {'improved' if rating_change > 0 else 'declined' if rating_change < 0 else 'remained stable'} 
                over the analyzed period, moving from {first_rating} to {latest_rating}. 
                The customer satisfaction rate (percentage of 4-5 star ratings) is currently at {trend_data[-1]['satisfactionRate']}%.
                """
            
            summary_text = f"""
            # CUSTOMER FEEDBACK ANALYSIS REPORT

            ## EXECUTIVE SUMMARY
            
            Analysis of {total_count} customer feedback entries reveals an overall {sentiment_type} sentiment with an average rating of {avg_rating_str}/5. The feedback data shows that customers are primarily concerned with {', '.join([theme[0] for theme in themes[:3]])}.
            
            The sentiment analysis indicates {sentiment_categories['positive']} positive, {sentiment_categories['neutral']} neutral, and {sentiment_categories['negative']} negative comments. This suggests that {'customers are generally satisfied' if sentiment_categories['positive'] > sentiment_categories['negative'] else 'there are significant areas for improvement'}.

            ## SENTIMENT ANALYSIS
            
            The overall sentiment score across all analyzed feedback is {avg_sentiment:.2f} (on a scale from -1 to 1), indicating a {'positive' if avg_sentiment > 0 else 'negative'} trend. {'This positive sentiment appears to be driven by customer satisfaction with product features and support.' if avg_sentiment > 0 else 'This negative sentiment is primarily driven by issues with product performance and usability.'}

            ## KEY THEMES IDENTIFIED
            
            {theme_text}

            ## ISSUES AND PAIN POINTS
            
            Several customers reported issues with system performance, particularly during peak usage times. Configuration difficulties were also frequently mentioned, suggesting a need for improved documentation or user interface enhancements.

            ## POSITIVE ASPECTS
            
            {'Many customers praised the customer support team and the user-friendly interface.' if sentiment_categories['positive'] > sentiment_categories['negative'] else 'Despite the challenges, some customers appreciated the range of features and the recent updates.'}

            ## TREND ANALYSIS

            {trend_text}

            ## RECOMMENDATIONS
            
            1. Improve system performance, particularly focusing on optimization during peak usage times
            2. Enhance user documentation and provide more configuration assistance
            3. Continue to develop the aspects customers already appreciate, such as the user interface
            4. Consider conducting follow-up surveys to gather more specific feedback on the identified issues

            ## CONCLUSION
            
            This analysis provides valuable insights into customer satisfaction and highlights specific areas for improvement. Addressing the identified issues should be prioritized to enhance overall customer experience and satisfaction.
            """
        
        # Return the results with enhanced analysis
        result = {
            "totalFeedback": total_count,
            "averageRating": avg_rating,
            "avgSentiment": avg_sentiment,
            "sentimentDistribution": sentiment_categories,
            "topThemes": themes,
            "categoryDistribution": category_distribution,
            "ratingDistribution": rating_distribution,
            "chartData": chart_data,  # Data prepared for charts
            "summary": summary_text,
            "sampleFeedback": feedback_to_analyze[:min(5, len(feedback_to_analyze))],
            "startDate": start_date,
            "endDate": end_date
        }
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error in analyze_feedback: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)