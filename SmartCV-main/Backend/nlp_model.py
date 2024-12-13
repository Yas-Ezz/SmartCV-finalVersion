import spacy
import PyPDF2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

# Load spaCy NER model
nlp = spacy.load("en_core_web_sm")

# Extract text from PDFs
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, "rb") as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text

# Extract emails and names using spaCy NER
def extract_entities(text):
    # Extract emails using regex
    emails = re.findall(r'\S+@\S+', text)
    # Extract names using spaCy NER
    doc = nlp(text)
    names = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
    return emails, names

# Rank resumes based on similarity
def rank_resumes(job_description, resume_paths):
    # Extract job description features using TF-IDF
    tfidf_vectorizer = TfidfVectorizer()
    job_desc_vector = tfidf_vectorizer.fit_transform([job_description])

    # Rank resumes
    ranked_resumes = []
    for resume_path in resume_paths:
        resume_text = extract_text_from_pdf(resume_path)
        emails, names = extract_entities(resume_text)
        resume_vector = tfidf_vectorizer.transform([resume_text])
        similarity = cosine_similarity(job_desc_vector, resume_vector)[0][0]
        ranked_resumes.append((names[0] if names else "N/A", emails[0] if emails else "N/A", similarity))

    # Sort resumes by similarity score
    ranked_resumes.sort(key=lambda x: x[2], reverse=True)
    return ranked_resumes
