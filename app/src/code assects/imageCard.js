import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Card from 'react-bootstrap/Card';
import React,{useRef,useState} from 'react';
import axios from 'axios';

const imagePath = '/assects/images/early blide.jpg'
let fapiURL = 'http://127.0.0.1:8000/image'
 
  export function ImageCard({ cardTitle, plantName, diseaseName, confidence }) {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [res,setRes] = useState()
  
    const handleButtonClick = () => {
      // Trigger the file input when the button is clicked
      fileInputRef.current.click();
    };
  
    const handleFileChange = async (event) => {
        // Handle file change here
        const file = event.target.files[0];
        setSelectedFile(file);
      
        if (file) {
          try {
            const response = await apiHandle({ file, apiURL: fapiURL });
            setRes(response);
          } catch (error) {
            console.error('Error in handling API:', error.message);
          }
        }
      };
      
      const plant = res ? 'Potato Leaf' :'null'
      const name = res ? res.DiseaseName : 'null'
      const confi = res ? res.Confidence : '0.0'
  
    return (
      <div className='card-container'>
        <Card className='custom-card'>
          <Card.Img
            className='card-image'
            variant="top"
            src={selectedFile ? URL.createObjectURL(selectedFile) : imagePath}
          />
          <Card.Body>
            <Card.Title>{cardTitle ? {} : 'Plant Disease Classification'}</Card.Title>
            <Card.Text><p>Plant Name : {plant}</p></Card.Text>
            <Card.Text><p>Disease Name : {name}</p></Card.Text>
            <Card.Text><p>confidence : {confi}%</p></Card.Text>
            <Button onClick={handleButtonClick} variant="primary">Upload & Predict</Button>
            <input type='file' ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
          </Card.Body>
        </Card>
      </div>
    );
  }
  
const apiHandle = async ({ file, apiURL }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(apiURL, formData);
      if (response.status === 200) {
        return response.data;
      } else {
        console.error('Error in uploading Image:', response.status, response.statusText);
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Error in uploading Image:', error.message);
      throw new Error('API request failed');
    }
  };
  
