const { createBasecampService } = require('../services/basecamp-service.ts');

async function testBasecampAPI() {
  try {
    console.log('🔧 Testing Basecamp API...');
    
    const basecampService = createBasecampService("default_user");
    
    console.log('Project ID:', basecampService.getProjectId());
    console.log('Card Table ID:', basecampService.getCardTableId());
    
    // Test getting columns first
    console.log('\n📋 Testing getColumns...');
    const columnsResponse = await basecampService.getColumns(
      basecampService.getProjectId(),
      basecampService.getCardTableId()
    );
    
    console.log('Columns response:', columnsResponse);
    
    // Test getting all cards
    console.log('\n🃏 Testing getAllCardsInTable...');
    const cardsResponse = await basecampService.getAllCardsInTable(
      basecampService.getProjectId(),
      basecampService.getCardTableId()
    );
    
    console.log('Cards response:', cardsResponse);
    
  } catch (error) {
    console.error('❌ Error testing Basecamp API:', error);
  }
}

// Run the test
testBasecampAPI(); 