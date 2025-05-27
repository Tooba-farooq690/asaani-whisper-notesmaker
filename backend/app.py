from flask import Flask, request, jsonify
from flask_cors import CORS
from whisper_utils import transcribe_audio

app = Flask(__name__)
CORS(app)

app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    result = transcribe_audio(file)
    return jsonify({'transcript': result})

if __name__ == '__main__':
    app.run(debug=True)

