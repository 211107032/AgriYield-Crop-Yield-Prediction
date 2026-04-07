import requests
import io

def test_disease_detection():
    url = "http://127.0.0.1:8000/api/detect-disease"
    
    # Create a dummy black image (100x100)
    # We can just send random bytes attempting to simulate a jpg
    dummy_image = b'\xFF\xD8\xFF\xE0' + b'\x00' * 100
    
    files = {'file': ('test.jpg', dummy_image, 'image/jpeg')}
    
    print(f"Testing {url}...")
    try:
        response = requests.post(url, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("SUCCESS: Endpoint is working.")
        else:
            print("FAILURE: Endpoint returned error.")
            
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to backend. Is it running on port 8000?")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_disease_detection()
