require('dotenv').config({ path: '.env' });

const { createBasecampService } = require('../services/basecamp-service.ts');

async function testColumns() {
  try {
    console.log('🔧 Testing Basecamp Columns API...');
    
    const basecampService = createBasecampService("default_user");
    
    console.log('Project ID:', basecampService.getProjectId());
    console.log('Card Table ID:', basecampService.getCardTableId());
    
    // Test getting columns
    console.log('\n📋 Testing getColumns...');
    const columnsResponse = await basecampService.getColumns(
      basecampService.getProjectId(),
      basecampService.getCardTableId()
    );
    
    console.log('Columns response success:', columnsResponse.success);
    if (columnsResponse.success && columnsResponse.data) {
      console.log('Available columns:');
      columnsResponse.data.forEach((col, index) => {
        console.log(`  ${index + 1}. ID: ${col.id}, Name: ${col.name}`);
      });
    } else {
      console.log('Columns error:', columnsResponse.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing columns:', error);
  }
}

// Run the test
testColumns(); 