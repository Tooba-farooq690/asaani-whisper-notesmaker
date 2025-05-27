# import whisper
# import tempfile

# model = whisper.load_model("base")

# def transcribe_audio(file_storage):
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
#         file_storage.save(tmp.name)
#         audio_path = tmp.name

#     result = model.transcribe(audio_path)
#     return result['text']


# import whisper
# import tempfile
# from transformers import AutoTokenizer, AutoModelForTokenClassification
# import torch

# model = whisper.load_model("base")

# punctuation_model_name = "oliverguhr/fullstop-punctuation-multilang-large"
# tokenizer = AutoTokenizer.from_pretrained(punctuation_model_name)
# punct_model = AutoModelForTokenClassification.from_pretrained(punctuation_model_name)

# def punctuate_text(text):
#     tokens = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    
#     with torch.no_grad():
#         outputs = punct_model(**tokens)
    
#     predictions = torch.argmax(outputs.logits, dim=-1)[0]
#     tokens_list = tokenizer.convert_ids_to_tokens(tokens["input_ids"][0])
    
#     punctuated_tokens = []
#     for token, pred_id in zip(tokens_list, predictions):
#         label = punct_model.config.id2label[pred_id.item()]
#         if label == "O":
#             punctuated_tokens.append(token)
#         elif label == "COMMA":
#             punctuated_tokens.append(token + ",")
#         elif label == "PERIOD":
#             punctuated_tokens.append(token + ".")
#         elif label == "QUESTION":
#             punctuated_tokens.append(token + "?")
#         else:
#             punctuated_tokens.append(token)

#     text_out = tokenizer.convert_tokens_to_string(punctuated_tokens)
#     text_out = text_out.replace(" ,", ",").replace(" .", ".").replace(" ?", "?")
    
#     return text_out


# def transcribe_audio(file_storage):
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
#         file_storage.save(tmp.name)
#         audio_path = tmp.name

#     result = model.transcribe(audio_path)
#     raw_text = result['text']

#     punctuated_text = punctuate_text(raw_text)

#     cleaned_text = punctuated_text.replace("<s>", "").replace("</s>", "").strip()

#     return cleaned_text





import whisper
import tempfile
from transformers import AutoTokenizer, AutoModelForTokenClassification
import torch

# Load Whisper model
model = whisper.load_model("base")

# Load punctuation model
punctuation_model_name = "oliverguhr/fullstop-punctuation-multilang-large"
tokenizer = AutoTokenizer.from_pretrained(punctuation_model_name)
punct_model = AutoModelForTokenClassification.from_pretrained(punctuation_model_name)

def punctuate_text(text, chunk_size=400):
    words = text.split()
    chunks = [' '.join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]

    full_output = []

    for chunk in chunks:
        tokens = tokenizer(chunk, return_tensors="pt", truncation=True, max_length=512)

        with torch.no_grad():
            outputs = punct_model(**tokens)

        predictions = torch.argmax(outputs.logits, dim=-1)[0]
        tokens_list = tokenizer.convert_ids_to_tokens(tokens["input_ids"][0])

        punctuated_tokens = []
        for token, pred_id in zip(tokens_list, predictions):
            label = punct_model.config.id2label[pred_id.item()]
            if label == "O":
                punctuated_tokens.append(token)
            elif label == "COMMA":
                punctuated_tokens.append(token + ",")
            elif label == "PERIOD":
                punctuated_tokens.append(token + ".")
            elif label == "QUESTION":
                punctuated_tokens.append(token + "?")
            else:
                punctuated_tokens.append(token)

        text_out = tokenizer.convert_tokens_to_string(punctuated_tokens)
        text_out = text_out.replace(" ,", ",").replace(" .", ".").replace(" ?", "?")
        full_output.append(text_out)

    return ' '.join(full_output)

def transcribe_audio(file_storage):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        file_storage.save(tmp.name)
        audio_path = tmp.name

    result = model.transcribe(audio_path)
    raw_text = result['text']

    punctuated_text = punctuate_text(raw_text)
    cleaned_text = punctuated_text.replace("<s>", "").replace("</s>", "").strip()

    return cleaned_text
