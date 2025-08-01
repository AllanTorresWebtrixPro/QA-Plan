const { createBasecampService } = require('../services/basecamp-service');

async function testDeleteCard() {
  try {
    console.log('Testing delete card functionality...');
    
    const basecampService = createBasecampService("default_user");
    const cardId = "8922693809"; // The card that's failing to delete
    
    console.log(`Attempting to delete card ${cardId}...`);
    
    // First, let's try to get the card to confirm it exists
    console.log('1. Checking if card exists...');
    const getCardResponse = await basecampService.getCardById(cardId);
    console.log('Get card response:', JSON.stringify(getCardResponse, null, 2));
    
    if (getCardResponse.success) {
      console.log('✅ Card exists, attempting to delete...');
      
      // Now try to delete it
      console.log('2. Attempting to delete card...');
      const deleteResponse = await basecampService.deleteCard(cardId);
      console.log('Delete response:', JSON.stringify(deleteResponse, null, 2));
      
    } else {
      console.log('❌ Card does not exist');
    }
    
  } catch (error) {
    console.error('Error testing delete card:', error);
  }
}

testDeleteCard(); 