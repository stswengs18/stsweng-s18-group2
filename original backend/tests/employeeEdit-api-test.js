const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api';
// Replace with valid MongoDB ObjectIds from your database
const EXISTING_EMPLOYEE_ID = '6873491ebe9b032bb70dc96c'; // Replace with real ID
const HEAD_USER_ID = '686e92a03c1f53d3ee65962b'; // Replace with real ID for a Head user

// Test data for updating an employee
const validUpdateData = {
  username: 'testuser_updated',
  email: 'updated@example.com',
  contact_number: '09876543210',
  first_name: 'Updated',
  last_name: 'User',
  middle_name: 'Test',
  spu_id: 'AMP'
};

// Test data with missing required fields
const invalidUpdateData = {
  username: '',
  email: 'invalid@example.com',
  // Missing contact_number
};

// Test data with password update
const passwordUpdateData = {
  ...validUpdateData,
  password: 'newPassword123'
};

// Test data with invalid SPU
const invalidSPUData = {
  ...validUpdateData,
  spu_id: 'INVALID'
};

// Mock the server-side session for testing
const setupAuthHeader = (userId, role = 'SDW') => {
  return {
    headers: {
      'X-Test-User-ID': userId,
      'X-Test-User-Role': role,
      'Content-Type': 'application/json'
    }
  };
};

// Test functions
async function testValidProfileUpdate() {
  try {
    // console.log('\n--- Testing VALID Profile Update ---');
    
    // Use a Head role for this test to ensure permissions
    const response = await axios.put(
      `${BASE_URL}/profile/edit/${EXISTING_EMPLOYEE_ID}`,
      validUpdateData,
      setupAuthHeader(HEAD_USER_ID, 'Head')
    );
    
    // console.log('✅ Profile updated successfully!');
    // console.log('Status:', response.status);
    // console.log('Response:', response.data);
    
    return true;
  } catch (error) {
    console.error('❌ Error updating profile:', error.response?.data || error.message);
    return false;
  }
}

async function testSelfProfileUpdate() {
  try {
    // console.log('\n--- Testing Self Profile Update ---');
    
    // User is updating their own profile
    const response = await axios.put(
      `${BASE_URL}/profile/edit/${EXISTING_EMPLOYEE_ID}`,
      validUpdateData,
      setupAuthHeader(EXISTING_EMPLOYEE_ID, 'SDW')
    );
    
    // console.log('✅ Self profile updated successfully!');
    // console.log('Status:', response.status);
    // console.log('Response:', response.data);
    
    return true;
  } catch (error) {
    console.error('❌ Error updating self profile:', error.response?.data || error.message);
    return false;
  }
}

async function testUnauthorizedProfileUpdate() {
  try {
    // console.log('\n--- Testing UNAUTHORIZED Profile Update ---');
    
    // SDW trying to update someone else's profile
    const OTHER_USER_ID = '777777777777'; // Different from EXISTING_EMPLOYEE_ID
    
    const response = await axios.put(
      `${BASE_URL}/profile/edit/${EXISTING_EMPLOYEE_ID}`,
      validUpdateData,
      setupAuthHeader(OTHER_USER_ID, 'SDW')
    );
    
    // console.log('❌ Test failed! Unauthorized update should be rejected');
    return false;
  } catch (error) {
    if (error.response?.status === 403) {
      // console.log('✅ Unauthorized update correctly rejected!');
      // console.log('Status:', error.response.status);
      // console.log('Response:', error.response.data);
      return true;
    } else {
      console.error('❌ Unexpected error:', error.response?.data || error.message);
      return false;
    }
  }
}

async function testInvalidDataProfileUpdate() {
  try {
    // console.log('\n--- Testing INVALID DATA Profile Update ---');
    
    const response = await axios.put(
      `${BASE_URL}/profile/edit/${EXISTING_EMPLOYEE_ID}`,
      invalidUpdateData,
      setupAuthHeader(HEAD_USER_ID, 'Head')
    );
    
    // console.log('❌ Test failed! Invalid data should be rejected');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      // console.log('✅ Invalid data correctly rejected!');
      // console.log('Status:', error.response.status);
      // console.log('Response:', error.response.data);
      return true;
    } else {
      console.error('❌ Unexpected error:', error.response?.data || error.message);
      return false;
    }
  }
}

async function testInvalidSPUProfileUpdate() {
  try {
    // console.log('\n--- Testing INVALID SPU Profile Update ---');
    
    const response = await axios.put(
      `${BASE_URL}/profile/edit/${EXISTING_EMPLOYEE_ID}`,
      invalidSPUData,
      setupAuthHeader(HEAD_USER_ID, 'Head')
    );
    
    // console.log('❌ Test failed! Invalid SPU should be rejected');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      // console.log('✅ Invalid SPU correctly rejected!');
      // console.log('Status:', error.response.status);
      // console.log('Response:', error.response.data);
      return true;
    } else {
      console.error('❌ Unexpected error:', error.response?.data || error.message);
      return false;
    }
  }
}

async function testPasswordUpdateProfile() {
  try {
    // console.log('\n--- Testing Password Update ---');
    
    const response = await axios.put(
      `${BASE_URL}/profile/edit/${EXISTING_EMPLOYEE_ID}`,
      passwordUpdateData,
      setupAuthHeader(EXISTING_EMPLOYEE_ID, 'SDW') // Self update with password
    );
    
    // console.log('✅ Password updated successfully!');
    // console.log('Status:', response.status);
    // console.log('Response:', response.data);
    
    return true;
  } catch (error) {
    console.error('❌ Error updating password:', error.response?.data || error.message);
    return false;
  }
}

// Add this route to employeeRoute.js if you want to verify profile updates
// router.get('/:id', authenticateToken, async (req, res) => {
//   try {
//     const user = await Employee.findById(req.params.id).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     return res.json(user);
//   } catch (error) {
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

async function verifyProfileUpdate() {
  try {
    // console.log('\n--- Verifying Profile Update ---');
    
    // You need to implement a GET profile endpoint first
    const response = await axios.get(
      `${BASE_URL}/profile/${EXISTING_EMPLOYEE_ID}`,
      setupAuthHeader(HEAD_USER_ID, 'Head')
    );
    
    // console.log('✅ Profile data retrieved!');
    // console.log('Data:', response.data);
    
    return true;
  } catch (error) {
    console.error('❌ Error verifying profile update:', error.response?.data || error.message);
    return false;
  }
}

// Run the tests
async function runTests() {
  // console.log('=== STARTING EMPLOYEE PROFILE API TESTS ===');
  
  let testResults = [];
  
  // Test valid profile update
  testResults.push({ name: 'Valid Profile Update', success: await testValidProfileUpdate() });
  
  // Test self-update
  testResults.push({ name: 'Self Profile Update', success: await testSelfProfileUpdate() });
  
  // Test unauthorized update
  testResults.push({ name: 'Unauthorized Update', success: await testUnauthorizedProfileUpdate() });
  
  // Test invalid data
  testResults.push({ name: 'Invalid Data Update', success: await testInvalidDataProfileUpdate() });
  
  // Test invalid SPU
  testResults.push({ name: 'Invalid SPU Update', success: await testInvalidSPUProfileUpdate() });
  
  // Test password update
  testResults.push({ name: 'Password Update', success: await testPasswordUpdateProfile() });
  
  // Only run verification if you've implemented the GET endpoint
  // testResults.push({ name: 'Verification', success: await verifyProfileUpdate() });
  
  // Report results
  // console.log('\n=== TEST RESULTS ===');
  testResults.forEach(test => {
    // console.log(`${test.success ? '✅' : '❌'} ${test.name}`);
  });
  
  const successRate = testResults.filter(t => t.success).length / testResults.length * 100;
  // console.log(`\nSuccess Rate: ${successRate.toFixed(2)}%`);
  // console.log('\n=== TESTS COMPLETED ===');
}

runTests();