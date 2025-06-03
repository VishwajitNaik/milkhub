// lib/storage.js

export async function putFile(file, path) {
    // Simulate uploading and return a mock file URL
    const fileName = path.split('/').pop();
    const mockUrl = `https://mock-storage-service.com/${path}`;
    
    // In a real implementation, you'd upload to S3, Firebase Storage, etc.
    console.log(`File "${fileName}" uploaded to path: ${path}`);
  
    return mockUrl;
  }
  