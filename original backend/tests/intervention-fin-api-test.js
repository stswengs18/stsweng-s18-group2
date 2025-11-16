const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api/interventions/financial';
// Replace with a valid MongoDB ObjectId from your database
const STATIC_SPONSORED_MEMBER_ID = '685e536add2b486dad9efd88'; 

// Test data for creating a financial intervention
const testInterventionData = {
  type_of_assistance: 'Food Assistance',
  area_and_subproject: 'FDQ',
  problem_presented: 'Family needs food assistance due to loss of income.',
  recommendation: 'Provide food assistance package for 2 weeks.'
};

// Test data for updating a financial intervention
const testUpdateData = {
  type_of_assistance: 'Medical Assistance to Family Member',
  area_and_subproject: 'AMP',
  problem_presented: 'Family member requires medical assistance for treatment.',
  recommendation: 'Provide financial assistance for hospital expenses.'
};

// Test functions
async function testCreateForm() {
  try {
    // console.log('\n--- Testing CREATE Financial Intervention Form ---');
    const response = await axios.post(
      `${BASE_URL}/create-form/${STATIC_SPONSORED_MEMBER_ID}`,
      testInterventionData
    );
    
    // console.log('✅ Form created successfully!');
    // console.log('Status:', response.status);
    // console.log('Created Form ID:', response.data._id);
    
    // Save the form ID for other tests
    return response.data._id;
  } catch (error) {
    console.error('❌ Error creating form:', error.response?.data || error.message);
    return null;
  }
}

async function testGetForm(formId) {
  try {
    // console.log('\n--- Testing GET Financial Intervention Form ---');
    if (!formId) {
      // console.log('⚠️ No form ID available. Skipping test.');
      return;
    }
    
    const response = await axios.get(
      `${BASE_URL}/viewform/${STATIC_SPONSORED_MEMBER_ID}/${formId}`
    );
    
    // console.log('✅ Form retrieved successfully!');
    // console.log('Status:', response.status);
    // console.log('Form Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Error retrieving form:', error.response?.data || error.message);
  }
}

async function testEditForm(formId) {
  try {
    // console.log('\n--- Testing EDIT Financial Intervention Form ---');
    if (!formId) {
      // console.log('⚠️ No form ID available. Skipping test.');
      return;
    }
    
    const response = await axios.put(
      `${BASE_URL}/edit-form/${formId}`,
      testUpdateData
    );
    
    // console.log('✅ Form updated successfully!');
    // console.log('Status:', response.status);
    // console.log('Update Response:', JSON.stringify(response.data, null, 2));
    
    // Verify the changes were applied by getting the form again
    // console.log('\n--- Verifying Form Update ---');
    const verifyResponse = await axios.get(
      `${BASE_URL}/viewform/${STATIC_SPONSORED_MEMBER_ID}/${formId}`
    );
    
    // console.log('✅ Updated form retrieved!');
    // console.log('Updated Form Data:', JSON.stringify(verifyResponse.data.form, null, 2));
    
    // Check if the update was applied correctly
    const updatedForm = verifyResponse.data.form;
    const updateSuccessful = 
      updatedForm.type_of_assistance === testUpdateData.type_of_assistance &&
      updatedForm.area_and_subproject === testUpdateData.area_and_subproject;
      
    if (updateSuccessful) {
      // console.log('✅ Update verification successful! Form data matches the update.');
    } else {
      // console.log('❌ Update verification failed! Form data does not match the update.');
    }
    
  } catch (error) {
    console.error('❌ Error updating form:', error.response?.data || error.message);
  }
}

async function testGetAllForms() {
  try {
    // console.log('\n--- Testing GET ALL Financial Intervention Forms ---');
    const response = await axios.get(
      `${BASE_URL}/getAllForms/${STATIC_SPONSORED_MEMBER_ID}`
    );
    
    // console.log('✅ All forms retrieved successfully!');
    // console.log('Status:', response.status);
    // console.log('Number of Forms:', response.data.length);
    // console.log('Form IDs:', response.data.map(form => form.id)); // CHANGED: _id → id
  } catch (error) {
    console.error('❌ Error retrieving all forms:', error.response?.data || error.message);
  }
}
// Run the tests
async function runTests() {
  // console.log('=== STARTING API TESTS ===');
  // console.log(`Using Sponsored Member ID: ${STATIC_SPONSORED_MEMBER_ID}`);
  
  // First create a form
  const formId = await testCreateForm();
  
  // Then test getting that specific form
  await testGetForm(formId);
  
  // Test editing the form
  await testEditForm(formId);
  
  // Finally test getting all forms
  await testGetAllForms();
  
  // console.log('\n=== TESTS COMPLETED ===');
}

runTests();