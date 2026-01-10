import google.generativeai as genai
import os

# Configure the Gemini API
# Note: It's recommended to use environment variables for API keys.
# For this example, we'll use the key directly.
API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyDYkoeDTXimWimGGevpTwGmPnqR_Ue9pEo")
genai.configure(api_key=API_KEY)

# Create the model
model = genai.GenerativeModel('models/gemini-2.5-flash')

def ask_gemini(question, context):
    """
    Answers a question based on the given context using the Gemini API.
    """
    prompt = f"""
    Context: {context}
    Question: {question}
    Answer:
    """
    response = model.generate_content(prompt)
    return response.text