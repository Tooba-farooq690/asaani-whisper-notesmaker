# asaani-whisper-notesmaker

##  How to Run Locally

Follow these steps to set up and run the backend locally:

```bash
# 1. Clone the repository
git clone https://github.com/Tooba-farooq690/asaani-whisper-notesmaker.git
cd asaani-whisper-notesmaker/backend

# 2. Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate   # On Windows
# Or use: source venv/bin/activate   # On macOS/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the Flask server
python app.py

This is the backend for **Asaani**, a simple and efficient transcription web app powered by OpenAI's Whisper model. It handles audio file uploads and returns transcribed text through a Flask-based API, and properly punctuates it using transformers.

## Features

- Accepts audio files via POST request  
- Uses Whisper to transcribe speech into text
- Properly punctuates the text using transformers  
- Returns clean, readable transcription  
- The transcription can be downloaded as a .pdf
- Simple and lightweight Flask server  
- CORS enabled for frontend integration  

## Built With

- Python 3.12+  
- Flask  
- OpenAI Whisper  
- Flask-CORS  
- Transformers



