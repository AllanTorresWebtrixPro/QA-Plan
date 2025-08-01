const { createBasecampService } = require('../services/basecamp-service');

async function findColumnIds() {
  try {
    console.log('Finding column IDs...');
    
    const basecampService = createBasecampService("default_user");
    
    // Try to get the card table info first
    const cardTableResponse = await basecampService.getCardTable(
      basecampService.getProjectId(),
      basecampService.getCardTableId()
    );
    
    console.log('Card table response:', JSON.stringify(cardTableResponse, null, 2));
    
    // Try to get columns using the card table ID
    const columnsResponse = await basecampService.getColumns(
      basecampService.getProjectId(),
      basecampService.getCardTableId()
    );
    
    console.log('Columns response:', JSON.stringify(columnsResponse, null, 2));
    
    if (columnsResponse.success && columnsResponse.data) {
      console.log('\nAvailable columns:');
      columnsResponse.data.forEach((column, index) => {
        console.log(`${index + 1}. ${column.name} (ID: ${column.id})`);
      });
    }
    
  } catch (error) {
    console.error('Error finding column IDs:', error);
  }
}

findColumnIds(); 