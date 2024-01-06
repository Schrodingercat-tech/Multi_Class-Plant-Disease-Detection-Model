from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import tensorflow as tf
from io import BytesIO
import numpy as np

model = tf.keras.models.load_model('./weights.h5')
class_names = ['Early Blight','Late Blight','Healthy']

origins = ["http://localhost:3000"]
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Adjust this to the domain of your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fake_data = {"name": 'This is Machine Learning Model Api'}

@app.get("/")
async def get_data():
    return fake_data

def file2tensor(data,# pass the image file
                shape=(256,256) # to convert image to shape the model is trained on the size
                ):
    img = Image.open(BytesIO(data))
    resize = img.resize(shape)
    img = np.array(resize)
    r3tensor = np.expand_dims(img,axis=0)/255.0
    return r3tensor

def fetch(file_):
    image = Image.open(BytesIO(file_))
    width, height = image.size
    batch = file2tensor(file_)
    prediction = model.predict(batch)
    name = class_names[np.argmax(prediction)]
    confidence = round(float(100*np.max(prediction)),2)
    return {
        'DiseaseName' : name,
        'Confidence' : confidence,
        'imgHeight' : height,
        'imgWidth' : width
    }

@app.post("/image")
async def process_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        recive = fetch(contents)
        return recive
    except Exception as error:
        return {"error": str(error)}
    


